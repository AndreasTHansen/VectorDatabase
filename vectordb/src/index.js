import weaviate from 'weaviate-ts-client'
import fs from 'fs';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

const schemaConfig = {
    'class': 'Animal',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}

await client.schema
    .classCreator()
    .withClass(schemaConfig)
    .do();





  const imageFilenames = [
    'ape1.jpg',
    'ape2.jpg',
    'ape3.jpg',
    'cat1.jpg',
    'cat2.jpg',
    'cat3.jpg',
    'dog1.jpg',
    'dog2.jpg',
    'dog3.jpg'
  ];
  
  async function uploadImages() {

    for (const filename of imageFilenames) {
      const filepath = `vectordb/src/img/${filename}`;
  
      try {
        const img = fs.readFileSync(filepath); // Read the image file
        const b64 = Buffer.from(img).toString('base64'); // Convert to base64
  
        const animalType = filename.split('.')[0]; // Extract the animal type from the filename
  
        await client.data.creator()
          .withClassName('Animal')
          .withProperties({
            image: b64,
            text: `${animalType} image`
          })
          .do();
  
        console.log(`Uploaded ${filename}`);
      } catch (error) {
        console.error(`Error uploading ${filename}:`, error);
      }
    }
  
    // Close the client or perform any necessary cleanup
  }
  
  // Call the function to start the image upload process
  uploadImages();