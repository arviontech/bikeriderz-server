export const mapImagePaths = (imageFiles?: Express.Multer.File[]): string[] => {
  return imageFiles ? imageFiles.map((file) => file.path) : [];
};
