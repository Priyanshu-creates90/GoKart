import multer from 'multer'; // Import the Multer library to handle file uploads

// Configure Multer to use in-memory storage
const storage = multer.memoryStorage(); 
/* 
  memoryStorage: 
  - Stores uploaded files in memory as Buffer objects.
  - The file will not be written to disk, making it suitable for immediate processing.
*/

// Initialize the Multer middleware with the configured storage engine
const upload = multer({ storage: storage });
/* 
  multer({ storage }): 
  - Sets the storage option to the in-memory storage we defined earlier.
  - This 'upload' middleware will now process file uploads and store them in memory.
*/

// Export the configured Multer middleware
export default upload;
/* 
  export default:
  - Allows the 'upload' middleware to be imported and used in other parts of the application.
  - This middleware can handle file uploads in routes.
*/
