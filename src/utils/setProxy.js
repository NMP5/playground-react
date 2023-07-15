const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/api', { // /api 로 시작하는 url 에 대해서 프록시 설정
            target: 'http://54.180.81.200:8080', // 비즈니스 서버 URL 설정
            changeOrigin: true
        })
    );
};