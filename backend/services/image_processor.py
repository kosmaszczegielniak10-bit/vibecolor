"""Image processing service for color extraction from uploaded images"""
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import io
from io import BytesIO
import logging
import colorsys
from typing import List


class ImageProcessor:
    """Extracts dominant colors from images using k-means clustering"""
    
    def __init__(self):
        pass
    
    def extract_colors(self, image_bytes: bytes, num_colors: int = 5) -> List[str]:
        """
        Extract dominant colors from image using improved k-means clustering
        with stratified multi-region sampling
        
        Args:
            image_bytes: Raw image bytes
            num_colors: Number of colors to extract
            
        Returns:
            List of hex color codes
        """
        try:
            # Load image from bytes
            image = Image.open(BytesIO(image_bytes))
            
            # Convert to RGB if needed (e.g., PNG with alpha channel)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize for faster processing BUT keep larger for better accuracy
            # Increased to 600px for maximum accuracy while maintaining performance
            max_size = 600
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Convert image to numpy array
            img_array = np.array(image)
            height, width = img_array.shape[:2]
            
            # STRATIFIED SAMPLING: Sample from different regions of image
            # This ensures we capture colors from all parts of the image
            # not just random pixels which might miss important regions
            
            # Divide image into grid (4x4 = 16 regions)
            grid_rows = 4
            grid_cols = 4
            region_height = height // grid_rows
            region_width = width // grid_cols
            
            # Sample pixels from each region
            sampled_pixels = []
            pixels_per_region = 3000  # Sample ~3000 pixels per region (increased from 2000 for MAXIMUM accuracy)
            
            for row in range(grid_rows):
                for col in range(grid_cols):
                    # Get region bounds
                    y_start = row * region_height
                    y_end = (row + 1) * region_height if row < grid_rows - 1 else height
                    x_start = col * region_width
                    x_end = (col + 1) * region_width if col < grid_cols - 1 else width
                    
                    # Extract region
                    region = img_array[y_start:y_end, x_start:x_end]
                    region_pixels = region.reshape(-1, 3)
                    
                    # Sample from this region
                    if len(region_pixels) > pixels_per_region:
                        indices = np.random.choice(len(region_pixels), pixels_per_region, replace=False)
                        region_sample = region_pixels[indices]
                    else:
                        region_sample = region_pixels
                    
                    sampled_pixels.append(region_sample)
            
            # Combine all sampled pixels
            pixels = np.vstack(sampled_pixels)
            
            # Advanced noise filtering
            # Remove pure black (< 10), pure white (> 245), and very grey pixels
            brightness = pixels.mean(axis=1)
            saturation = pixels.std(axis=1)
            
            # Keep pixels that are:
            # - Not too dark (brightness > 10)
            # - Not too bright (brightness < 245)
            # - Have some saturation (std > 3) OR are intentionally grey/black/white
            # Relaxed from >5 to >3 to keep more color data
            mask = (brightness > 10) & (brightness < 245) & ((saturation > 3) | (brightness < 30) | (brightness > 220))
            filtered_pixels = pixels[mask]
            
            # If too few pixels left, use less aggressive filtering
            if len(filtered_pixels) < 500:
                mask = (brightness > 5) & (brightness < 250)
                filtered_pixels = pixels[mask]
            
            # If still too few, use original
            if len(filtered_pixels) < 100:
                filtered_pixels = pixels
            
            # Sample pixels if too many (for performance)
            # Increased to 25000 for MAXIMUM accuracy with more colors (15+)
            max_pixels = 25000
            if len(filtered_pixels) > max_pixels:
                indices = np.random.choice(len(filtered_pixels), max_pixels, replace=False)
                filtered_pixels = filtered_pixels[indices]
            
            # Apply k-means clustering with more iterations for better accuracy
            # Increased n_init from 10 to 20 for better convergence
            kmeans = KMeans(
                n_clusters=num_colors, 
                random_state=42, 
                n_init=20,
                max_iter=500  # More iterations for better convergence
            )
            kmeans.fit(filtered_pixels)
            
            # Get cluster centers (dominant colors)
            colors = kmeans.cluster_centers_.astype(int)
            
            # Calculate cluster importance based on:
            # 1. Number of pixels in cluster
            # 2. Total saturation of cluster
            # 3. Variance within cluster (prefer coherent clusters)
            labels = kmeans.labels_
            sorted_colors = []
            
            for i in range(num_colors):
                cluster_pixels = filtered_pixels[labels == i]
                count = len(cluster_pixels)
                
                # Calculate saturation (std of RGB values)
                saturation = np.std(cluster_pixels, axis=0).mean()
                
                # Calculate cluster coherence (inverse of variance)
                coherence = 1.0 / (np.var(cluster_pixels) + 1.0)
                
                # Combined score: count (60%), saturation (20%), coherence (20%)
                score = (count * 0.6) + (saturation * count * 0.2) + (coherence * count * 0.2)
                
                sorted_colors.append((score, colors[i]))
            
            # Sort by importance score
            sorted_colors.sort(reverse=True, key=lambda x: x[0])
            
            # Convert RGB to hex WITH MINIMAL DEDUPLICATION
            # Only reject TRULY IDENTICAL colors, allow similar ones
            hex_colors = []
            unique_rgb_colors = []  # Store RGB tuples for deduplication
            
            for _, rgb in sorted_colors:
                # Clamp values to valid range
                r, g, b = np.clip(rgb, 0, 255).astype(int)
                current_rgb = (int(r), int(g), int(b))
                
                # MINIMAL deduplication - only prevent IDENTICAL colors
                is_unique = True
                for existing_rgb in unique_rgb_colors:
                    # Calculate RGB distance
                    rgb_distance = np.sqrt(
                        (current_rgb[0] - existing_rgb[0]) ** 2 +
                        (current_rgb[1] - existing_rgb[1]) ** 2 +
                        (current_rgb[2] - existing_rgb[2]) ** 2
                    )
                    
                    # ONLY reject if nearly identical (RGB distance < 10)
                    # This allows similar colors but prevents exact duplicates
                    if rgb_distance < 10:
                        is_unique = False
                        break
                
                # Only add if unique
                if is_unique:
                    hex_color = f'#{r:02X}{g:02X}{b:02X}'
                    hex_colors.append(hex_color)
                    unique_rgb_colors.append(current_rgb)
                    
                    # Stop when we have enough unique colors
                    if len(hex_colors) >= num_colors:
                        break
            
            # If we still don't have enough colors (very monotone image),
            # generate varied versions with better distribution
            max_attempts = num_colors * 20  # Prevent infinite loop
            attempts = 0
            
            while len(hex_colors) < num_colors and len(unique_rgb_colors) > 0 and attempts < max_attempts:
                attempts += 1
                
                # Cycle through base colors for variety
                base_idx = (len(hex_colors) + attempts) % len(unique_rgb_colors)
                base_rgb = unique_rgb_colors[base_idx]
                
                # Create different types of variations with STRONGER differences
                variation_type = attempts % 4
                
                if variation_type == 0:
                    # Lighter (increased from 60 to 80)
                    varied_r = int(np.clip(base_rgb[0] + 80, 0, 255))
                    varied_g = int(np.clip(base_rgb[1] + 80, 0, 255))
                    varied_b = int(np.clip(base_rgb[2] + 80, 0, 255))
                elif variation_type == 1:
                    # Darker (increased from 60 to 80)
                    varied_r = int(np.clip(base_rgb[0] - 80, 0, 255))
                    varied_g = int(np.clip(base_rgb[1] - 80, 0, 255))
                    varied_b = int(np.clip(base_rgb[2] - 80, 0, 255))
                elif variation_type == 2:
                    # More saturated (increased from 0.5 to 0.7)
                    avg = (base_rgb[0] + base_rgb[1] + base_rgb[2]) // 3
                    varied_r = int(np.clip(base_rgb[0] + (base_rgb[0] - avg) * 0.7, 0, 255))
                    varied_g = int(np.clip(base_rgb[1] + (base_rgb[1] - avg) * 0.7, 0, 255))
                    varied_b = int(np.clip(base_rgb[2] + (base_rgb[2] - avg) * 0.7, 0, 255))
                else:
                    # Less saturated (increased from 0.5 to 0.7)
                    avg = (base_rgb[0] + base_rgb[1] + base_rgb[2]) // 3
                    varied_r = int(np.clip(base_rgb[0] - (base_rgb[0] - avg) * 0.7, 0, 255))
                    varied_g = int(np.clip(base_rgb[1] - (base_rgb[1] - avg) * 0.7, 0, 255))
                    varied_b = int(np.clip(base_rgb[2] - (base_rgb[2] - avg) * 0.7, 0, 255))
                
                varied_rgb = (varied_r, varied_g, varied_b)
                
                # MINIMAL deduplication - only reject if nearly identical
                is_unique = True
                for existing_rgb in unique_rgb_colors:
                    rgb_distance = np.sqrt(
                        (varied_rgb[0] - existing_rgb[0]) ** 2 +
                        (varied_rgb[1] - existing_rgb[1]) ** 2 +
                        (varied_rgb[2] - existing_rgb[2]) ** 2
                    )
                    
                    # Only reject if RGB distance < 10 (nearly identical)
                    if rgb_distance < 10:
                        is_unique = False
                        break
                
                # Add even if similar (user wants num_colors colors!)
                if is_unique:
                    hex_color = f'#{varied_r:02X}{varied_g:02X}{varied_b:02X}'
                    hex_colors.append(hex_color)
                    unique_rgb_colors.append(varied_rgb)
            
            return hex_colors
            
        except Exception as e:
            print(f"Error extracting colors from image: {e}")
            raise ValueError(f"Failed to process image: {str(e)}")
    
    def rgb_to_hex(self, r: int, g: int, b: int) -> str:
        """Convert RGB values to hex color code"""
        return f'#{r:02X}{g:02X}{b:02X}'
