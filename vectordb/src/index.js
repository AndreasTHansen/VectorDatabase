import weaviate from 'weaviate-ts-client'
import * as fs from 'fs';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

/*
//Delete Class
const ress = await client.schema
    .classDeleter()
    .withClassName('Animals1')
    .do();
console.log(JSON.stringify(ress));
*/

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

const schemaConfig = {
    'class': 'Animals1',
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
      const filepath = `./src/img/${filename}`;
  
      try {
        const img = fs.readFileSync(filepath); // Read the image file
        const b64 = Buffer.from(img).toString('base64'); // Convert to base64
  
        const animalType = filename.split('.')[0]; // Extract the animal type from the filename
  
        await client.data.creator()
          .withClassName('Animals1')
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
    }
  
  // Call the function to start the image upload process
  uploadImages();
  


const test = Buffer.from( fs.readFileSync('./src/test.jpg') ).toString('base64');

const resImage = await client.graphql.get()
  .withClassName('Animals1')
  .withFields(['image'])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

// Write result to filesystem
const result = resImage.data.Get.Animals1[0].image;
writeFileSync('./result.jpg', result, 'base64');




