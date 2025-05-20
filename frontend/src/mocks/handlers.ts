import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('/api/favorites', () => {
        return HttpResponse.json([
            { id: 1, name: 'Final Phase' },
            { id: 2, name: 'うまぴょい伝説werfewthreut' },
        ]);
    }),
];
