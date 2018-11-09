package com.example.geo.controller;

import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.geo.payload.UploadFileResponse;
import com.example.geo.service.FileStorageService;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private FileStorageService fileStorageService;

	@CrossOrigin(origins = "http://localhost:4200")
	@PostMapping("/uploadFile")
	public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
		String fileName = fileStorageService.storeFile(file);

		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
				.path(fileName).toUriString();
		BufferedImage image;
		int width = 0;
		int height = 0;
		try {
			image = ImageIO.read(file.getInputStream());
			 width = image.getWidth();
			 height = image.getHeight();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
       
		return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize(), width, height);
	
		}
	
	@CrossOrigin
	@PostMapping("/cropAndUploadFile")
	public UploadFileResponse cropAndUploadFile(@RequestParam("file") MultipartFile file, @RequestParam("xCoord") String xCoord, @RequestParam("yCoord") String yCoord,@RequestParam("hRect") String hRect,@RequestParam("wRect") String wRect) {
		String fileName = fileStorageService.cropAndStoreFile(file, xCoord, yCoord, hRect, wRect);

		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
				.path(fileName).toUriString();
		BufferedImage image;
		int width = 0;
		int height = 0;
		try {
			image = ImageIO.read(file.getInputStream());
			 width = image.getWidth();
			 height = image.getHeight();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
       
		return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize(), width, height);
	
		}
	
	

	@CrossOrigin(origins = "http://localhost:4200")
	@GetMapping("/downloadFile/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
		// Load file as Resource
		Resource resource = fileStorageService.loadFileAsResource(fileName);

		// Try to determine file's content type
		String contentType = null;
		try {
			contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
		} catch (IOException ex) {
			logger.info("Could not determine file type.");
		}

		// Fallback to the default content type if type could not be determined
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
}
