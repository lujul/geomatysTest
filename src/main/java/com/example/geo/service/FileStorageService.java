package com.example.geo.service;

import org.springframework.stereotype.Service;

import com.example.geo.exception.FileStorageException;
import com.example.geo.exception.MyFileNotFoundException;
import com.example.geo.property.FileStorageProperties;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.imageio.ImageIO;

@Service
public class FileStorageService {

	private final Path fileStorageLocation;

	@Autowired
	public FileStorageService(FileStorageProperties fileStorageProperties) {
		this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
					ex);
		}
	}

	public String storeFile(MultipartFile file) {
		// Normalize file name
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());

		// Check if the file's name contains invalid characters
		if (fileName.contains("..")) {
			throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
		}

		// Copy file to the target location (Replacing existing file with the same name)
		 Path targetLocation = this.fileStorageLocation.resolve(fileName);
		try {
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return fileName;

	}

	public String cropAndStoreFile(MultipartFile file, String xCoord, String yCoord, String hRect, String wRect) {
		// Normalize file name
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());

		try {
			// Check if the file's name contains invalid characters
			if (fileName.contains("..")) {
				throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
			}

			// Copy file to the target location (Replacing existing file with the same name)
			Path targetLocation = this.fileStorageLocation.resolve(fileName);
			//File fifi = targetLocation.toFile();
			File fifi = convert(file);
			// CROP
			BufferedImage img = null;
			BufferedImage out = null;
			try {

				img = ImageIO.read(fifi);
				
				System.out.println("xCoord: "+ xCoord);
				System.out.println("yCoord: "+ yCoord);
				System.out.println("Width: "+ wRect);
				System.out.println("Height: "+ hRect);
				System.out.println("Width: "+ img.getWidth());
				System.out.println("Height: "+ img.getHeight());
				
				out = img.getSubimage(Integer.parseInt(xCoord), Integer.parseInt(yCoord), Integer.parseInt(wRect),
						Integer.parseInt(hRect));
				
				System.out.println("Width: "+ out.getWidth());
				System.out.println("Height: "+ out.getHeight());

			} catch (IOException e) {
				throw new FileStorageException("Could not read image.", e);

			}
			try {

				String extention = FilenameUtils.getExtension(fileName);
				System.out.println(extention);
				ImageIO.write(out, extention, fifi);

			} catch (IOException e) {
				throw new FileStorageException("Could not copy image.", e);
			}
			// END CROP
        	 InputStream targetStream = new FileInputStream(fifi);
			 Files.copy(targetStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
			 return fileName;
		} catch (IOException ex) {
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
		}
	}

	public Resource loadFileAsResource(String fileName) {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new MyFileNotFoundException("File not found " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new MyFileNotFoundException("File not found " + fileName, ex);
		}
	}

	public static File convert(MultipartFile file) throws IOException {
		File convFile = new File(file.getOriginalFilename());
		convFile.createNewFile();
		FileOutputStream fos = new FileOutputStream(convFile);
		fos.write(file.getBytes());
		fos.close();
		return convFile;
	}

	private static String getFileExtension(String fileName) {

		int lastIndexOf = fileName.lastIndexOf(".");
		if (lastIndexOf == -1) {
			return ""; // empty extension
		}
		return fileName.substring(lastIndexOf);
	}

}
