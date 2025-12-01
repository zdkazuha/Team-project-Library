using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Core.Services;

public class AzureBlobService : IFileService
{
    private const string containerName = "images";
    private readonly string connectionString = null;

    public AzureBlobService(IConfiguration configuration)
    {
        connectionString = configuration.GetConnectionString("AzureBlobs")!;
    }

    public async Task<string> SaveImage(IFormFile file)
    {
        var client = new BlobContainerClient(connectionString, containerName);
        await client.CreateIfNotExistsAsync();
        await client.SetAccessPolicyAsync(PublicAccessType.Blob);

        // generate new file name
        string name = Guid.NewGuid().ToString();             // random name
        string extension = Path.GetExtension(file.FileName); // get original extension
        string fullName = name + extension;                  // full name: name.ext

        BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
        {
            ContentType = file.ContentType
        };

        var blob = client.GetBlobClient(fullName);
        await blob.UploadAsync(file.OpenReadStream(), httpHeaders);

        return blob.Uri.ToString();
    }

    public Task DeleteImage(string path)
    {
        throw new NotImplementedException();
    }
}
