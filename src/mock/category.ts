const getCategory = (): Category => {
    return {
        label: '전체',
        items: [
            {
                label: 'node',
                items: [
                    {
                        label: 'README.md',
                        filename: 'ㅇㄴㄹㄴㅇㄹ',
                        items: [],
                    },
                    {
                        label: 'README.md',
                        filename:
                            'ㅇㄴㄹㄴㅇㄹ----dsnkfdsnfjkdsnkfjsdnkjdsfnksfdnkjsfdnkfsdnkfskj',
                        items: [],
                    },
                    {
                        label: 'README.md',
                        filename: 'ㅇㄴㄹㄴㅇㄹ',
                        items: [],
                    },
                ],
            },
            {
                label: 'typescript',
                items: [
                    {
                        label: 'README.md',
                        filename: 'ㅇㄴㄹㄴㅇㄹ',
                        items: [],
                    },
                    {
                        label: 'README.md',
                        filename: 'ㄴㅇㄹㄴㅇㄹ',
                        items: [],
                    },
                    {
                        label: 'README.md',
                        filename: 'ㄴㅇㄹㄴㅇㄹ',
                        items: [],
                    },
                    {
                        label: 'README.md',
                        filename: 'ㄴㅇㄹㄴㄹㅇㄹㄴ',
                        items: [],
                    },
                ],
            },
        ],
    }
}
export default {
    getCategory,
}
