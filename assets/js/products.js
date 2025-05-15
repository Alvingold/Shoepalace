const products = {
    'men-nike-airmax': {
        id: 'men-nike-airmax',
        title: 'Nike Air Max 90',
        brand: 'Nike',
        price: 29999,
        // originalPrice: 34999,
        // discount: 15,
        rating: 4.5,
        reviewCount: 45,
        category: 'men',
        description: 'Experience ultimate comfort with the iconic Nike Air Max 90. Featuring visible Air cushioning and a classic design.',
        longDescription: `
            <p>The Nike Air Max 90 represents the perfect blend of style and comfort. These iconic sneakers feature:</p>
            <ul>
                <li>Visible Air cushioning for maximum comfort</li>
                <li>Breathable mesh upper with synthetic overlays</li>
                <li>Rubber outsole with enhanced traction</li>
                <li>Classic design with modern updates</li>
                <li>Available in multiple colorways</li>
            </ul>
        `,
        images: [
            'assets/images/products/men/nike-airmax-90/1.png',
            'assets/images/products/men/nike-airmax-90/2.png',
            'assets/images/products/men/nike-airmax-90/3.png',
            'assets/images/products/men/nike-airmax-90/4.png'
        ],
        sizes: ['7', '8', '9', '10', '11', '12'],
        colors: [
            { name: 'Black', code: '#000000' },
            // { name: 'White', code: '#FFFFFF' },
            // { name: 'Red', code: '#FF0000' }
        ],
        specifications: {
            material: 'Mesh and Synthetic',
            sole: 'Rubber',
            closure: 'Lace-up',
            weight: '300g (Size 9)',
            cushioning: 'Air Max',
            arch: 'Neutral',
            terrain: 'Urban',
            warranty: '1 Year'
        },
        inStock: true,
        featured: true,
        reviews: [
            {
                name: 'John D.',
                rating: 5,
                date: '2024-01-15',
                title: 'Best Nike shoes ever!',
                comment: 'These shoes are incredibly comfortable and look amazing. Worth every penny!'
            },
            {
                name: 'Sarah M.',
                rating: 4,
                date: '2024-02-01',
                title: 'Great for everyday wear',
                comment: 'Perfect for both casual and athletic use. Only giving 4 stars because they run slightly large.'
            }
        ]
    },
    // 'women-nike-freerun': {
    //     id: 'women-nike-freerun',
    //     title: 'Nike Free Run',
    //     brand: 'Nike',
    //     price: 27999,
    //     originalPrice: 32999,
    //     discount: 15,
    //     rating: 4.5,
    //     reviewCount: 42,
    //     category: 'women',
    //     description: 'Lightweight and flexible running shoes designed for natural movement.',
    //     longDescription: `
    //         <p>The Nike Free Run is designed for runners who want a more natural feel. Features include:</p>
    //         <ul>
    //             <li>Flexible sole for natural movement</li>
    //             <li>Breathable mesh upper</li>
    //             <li>Lightweight construction</li>
    //             <li>Enhanced flexibility</li>
    //             <li>Responsive cushioning</li>
    //         </ul>
    //     `,
    //     images: [
    //         'assets/images/products/women-1.jpg',
    //         'assets/images/products/women-1-alt1.jpg',
    //         'assets/images/products/women-1-alt2.jpg',
    //         'assets/images/products/women-1-alt3.jpg'
    //     ],
    //     sizes: ['5', '6', '7', '8', '9', '10'],
    //     colors: [
    //         { name: 'Pink', code: '#FFC0CB' },
    //         { name: 'White', code: '#FFFFFF' },
    //         { name: 'Black', code: '#000000' }
    //     ],
    //     specifications: {
    //         material: 'Mesh',
    //         sole: 'Rubber',
    //         closure: 'Lace-up',
    //         weight: '250g (Size 7)',
    //         cushioning: 'Free',
    //         arch: 'Neutral',
    //         terrain: 'Road',
    //         warranty: '1 Year'
    //     },
    //     inStock: true,
    //     featured: true,
    //     reviews: [
    //         {
    //             name: 'Emma L.',
    //             rating: 5,
    //             date: '2024-01-20',
    //             title: 'Perfect for running',
    //             comment: 'These shoes feel like they were made for my feet. So comfortable!'
    //         }
    //     ]
    // },
    // 'kids-adidas-runner': {
    //     id: 'kids-adidas-runner',
    //     title: 'Adidas Kids Runner',
    //     brand: 'Adidas',
    //     price: 19999,
    //     originalPrice: 22999,
    //     discount: 13,
    //     rating: 4.5,
    //     reviewCount: 28,
    //     category: 'kids',
    //     description: 'Comfortable and durable running shoes for active kids.',
    //     longDescription: `
    //         <p>Designed specifically for kids, these Adidas runners offer:</p>
    //         <ul>
    //             <li>Durable construction for active play</li>
    //             <li>Easy on/off design</li>
    //             <li>Comfortable fit</li>
    //             <li>Breathable materials</li>
    //             <li>Stylish design kids love</li>
    //         </ul>
    //     `,
    //     images: [
    //         'assets/images/products/kids-1.jpg',
    //         'assets/images/products/kids-1-alt1.jpg',
    //         'assets/images/products/kids-1-alt2.jpg',
    //         'assets/images/products/kids-1-alt3.jpg'
    //     ],
    //     sizes: ['1', '2', '3', '4', '5'],
    //     colors: [
    //         { name: 'Blue', code: '#0000FF' },
    //         { name: 'Red', code: '#FF0000' },
    //         { name: 'Green', code: '#008000' }
    //     ],
    //     specifications: {
    //         material: 'Synthetic',
    //         sole: 'Rubber',
    //         closure: 'Velcro',
    //         weight: '200g (Size 3)',
    //         cushioning: 'Cloudfoam',
    //         arch: 'Neutral',
    //         terrain: 'Urban',
    //         warranty: '6 Months'
    //     },
    //     inStock: true,
    //     featured: false,
    //     reviews: [
    //         {
    //             name: 'Parent R.',
    //             rating: 5,
    //             date: '2024-02-10',
    //             title: 'Great kids shoes',
    //             comment: 'My son loves these shoes. They\'re easy to put on and very comfortable.'
    //         }
    //     ]
    // }
    // Add more products as needed
};

// Export the products data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products };
} else {
    window.products = products;
} 