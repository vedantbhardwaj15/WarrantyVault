const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
class S3Service{
    //upload to S3
    async uploadFile(file,fileName){
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `warranties/${fileName}`,
            Body: file.buffer,
            ContentType:file.mimetype,
            ACL: 'private'
        };

        try{
            const result = await s3.upload(params).promise();
            console.log(`File uploaded successfully:${result.Location}`);
            return{
                success: true,
                url: result.Location,
                key: result.Key
            };
        }catch(error){
            console.error('S3 upload error:', error);
            throw new Error('File upload failed');
        }
    }

    // Generate signed URL for secure fileaccess
    getSignedUrl(key, expiresIn = 3600) {
        const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Expires: expiresIn // URL expires in 1 hour
        };  
        return s3.getSignedUrl('getObject', params);
    }

    // Delete file from S3
    async deleteFile(key){
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        };
        try{
            await s3.deleteObject(params).promise();
            console.log(`File deleted: ${key}`);
            return true;
        } catch(error){
            console.error('S3 delete error:', error);
            return false;
        }
    }
}

module.exports = new S3Service();