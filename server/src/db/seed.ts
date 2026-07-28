import ProductModel from './Product.db';

const seedProducts = async () => {
  try {
    // Check the current number of products in the database
    const count = await ProductModel.count();

    // If the data base is empty (count == 0), insert the default products
    if (count === 0) {
      console.log('Database is empty.');
      await ProductModel.bulkCreate([
        {
          name: 'Webbpacket',
          description: 'En komplett webbplats anpassad efter ditt företags behov.',
          price: 1500,
          category: 'webdev',
        },
        {
          name: 'Marknadsföringspaket',
          description: 'Strategisk digital marknadsföring för att effektivt nå din målgrupp.',
          price: 800,
          category: 'consultation',
        },
        {
          name: 'Varumärkespaket',
          description: 'Komplett visuell identitet inklusive logotypdesign och färgpaletter.',
          price: 1200,
          category: 'design',
        },
        {
          name: 'Applikationspaket',
          description: 'Anpassad webbapplikationer byggda med moderna ramverk för skalbarhet.',
          price: 2500,
          category: 'appdev',
        },
        {
          name: 'Helhetspaket',
          // eslint-disable-next-line @stylistic/max-len
          description: 'Den ultimata lösningen som inkluderar webbplats, marknadsföring och varumärkestjänster.',
          price: 4000,
          category: 'webdev',
        },
      ]);
      console.log('Default products seeded successfully');
    } else {
      console.log(`Database already contains ${count} products, skipping seeding`);
    }
  } catch (error) {
    console.error('Something went wrong while seeding the database', error);
  }
};

export default seedProducts;
