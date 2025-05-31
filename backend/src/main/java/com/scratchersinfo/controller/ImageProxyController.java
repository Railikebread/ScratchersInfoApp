package com.scratchersinfo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/proxy")
@CrossOrigin(origins = "*")
public class ImageProxyController {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @GetMapping("/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            // Only allow NY Lottery domain for security
            if (!url.startsWith("https://edit.nylottery.ny.gov/")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Fetch the image
            byte[] imageBytes = restTemplate.getForObject(url, byte[].class);
            
            // Determine content type based on file extension
            MediaType contentType = MediaType.IMAGE_JPEG;
            if (url.endsWith(".png")) {
                contentType = MediaType.IMAGE_PNG;
            } else if (url.endsWith(".webp")) {
                contentType = MediaType.valueOf("image/webp");
            }
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(contentType);
            headers.setCacheControl("public, max-age=86400"); // Cache for 1 day
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 