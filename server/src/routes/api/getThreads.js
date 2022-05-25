
// sample route to simulate a get request to the api
module.exports = (req, res) => {
    // should return an array containing all the threads
    res.status(200).json([
        {
            id: 1,
            title: 'Thread 1',
            description: 'This is thread 1',
            createdAt: '2020-01-01',
            updatedAt: '2020-01-01',
            user: {
                id: 1,
                name: 'User 1',
            }
        },
        {
            id: 2,
            title: 'Thread 2',
            description: 'This is thread 2',
            createdAt: '2020-01-01',
            updatedAt: '2020-01-01',
            user: {
                id: 2,
                name: 'User 2',
            }
        }
    ]);
}