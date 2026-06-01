package com.pali.palindromebackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 03/06/2021
 **/
@Service
public class FileService {
    @Value("${media-upload.path}")
    private String UploadPath;

    public byte[] getMedia(String path) {
        try {

            if (!(path == null)) {
                Path p = Paths.get(path);
                return Files.readAllBytes(p);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getFilePath(MultipartFile file, String mediaCategory) {
        String fileName, fileType, mediaUploadPath, folderPath, date;
        fileName = file.getOriginalFilename();
        fileType = file.getContentType();
        mediaUploadPath = UploadPath + mediaCategory;
        folderPath = mediaUploadPath + fileType;
        date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss-"));
        return folderPath + "/" + date + "____" + fileName; // use either file.separator or "/"
    }

    public String saveFile(MultipartFile file, String folderType) {
        String filePath = getFilePath(file, folderType);
        String output;
        File file1 = new File(filePath);

        try (FileOutputStream fos = new FileOutputStream(file1)) {
            byte[] bytes = file.getBytes();
            fos.write(bytes);
            output = filePath;
        } catch (IOException e) {
            System.out.println("Error when you saving your file. Try again!");
            output = null;
        }
        return output;
    }

    public void deleteFile(String profilePicture) {
        try {
            if (profilePicture != null)
                Files.deleteIfExists(Paths.get(profilePicture));
        } catch (NoSuchFileException e) {
            System.out.println("No such file/directory exists");
        } catch (DirectoryNotEmptyException e) {
            System.out.println("Directory is not empty.");
        } catch (IOException e) {
            System.out.println("Invalid permissions.");
        }
    }
}
