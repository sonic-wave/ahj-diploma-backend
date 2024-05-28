// const http = require('http');
// const Koa = require('koa');
// const { koaBody } = require('koa-body');
// const app = new Koa();

// let messages = [];

// app.use(
//   koaBody({
//     urlencoded: true,
//     multipart: true,
//     formidable: { maxFileSize: 200 * 1024 * 1024 }, // Установка максимального размера файла (в данном случае 200 МБ)
//   })
// );

// app.use(async (ctx, next) => {
//   ctx.response.set('Access-Control-Allow-Origin', '*');
//   ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
//   ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
//   console.log('Setting CORS headers');
//   await next();
// });

// app.use(async (ctx, next) => {
//   if (ctx.request.method === 'OPTIONS') {
//     console.log('Received OPTIONS request');
//     ctx.response.set('Access-Control-Allow-Origin', '*');
//     ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
//     ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
//     ctx.response.status = 204;
//     return;
//   }
//   await next();
// });

// app.use(async (ctx, next) => {
//   if (ctx.request.method !== 'POST') {
//     await next();
//     return;
//   }

//   const url = ctx.request.url;
//   const method = url.split("/?method=")[1];

//   if (method === 'createTextMessage') {
//     console.log('Received createTextMessage request');
//     console.log(ctx.request.body);
//     // messages.push(ctx.request.body);
//     const textMessageValue = ctx.request.body.message;
//     ctx.response.body = { responseMessage: textMessageValue };
//     ctx.response.status = 201; // Set status code to 201 Created
//   }

//   if (method === 'createFileMessage') {
//     console.log('Received createFileMessage request');
//     console.log(ctx.request.body);
//     // messages.push(ctx.request.body);
//     const filetMessageValue = ctx.request.body.message;
//     ctx.response.body = { responseMessage: filetMessageValue };
//     ctx.response.status = 201; // Set status code to 201 Created
//   }

//   await next();
// });

// // Другие обработчики middleware...

// const server = http.createServer(app.callback());

// const port = 7070;

// server.listen(port, (err) => {
//   if (err) {
//     console.error('Server startup error:', err);
//     return;
//   }

//   console.log('Server is listening on port ' + port);
// });

const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body'); // Убедитесь, что `koa-body` импортирован правильно
const app = new Koa();
let messages = [];

app.use(
  koaBody({
    jsonLimit: '200mb',
    formLimit: '200mb',
    textLimit: '200mb',
    multipart: true,
    formidable: { maxFileSize: 200 * 1024 * 1024 },
  })
);

app.use(async (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
    ctx.response.status = 204;
    return;
  }
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    const url = ctx.request.url;
    const method = url.split("/?method=")[1];

    if (method === 'createTextMessage') {
      const responseObject = {
        value: ctx.request.body.value,
        type: ctx.request.body.type,
      }
      messages.push(responseObject);

      ctx.response.body = { responseMessage: responseObject.value };
      ctx.response.status = 201; 
    }

    if (method === 'createFileMessage') {
      const responseObject = {
        value: ctx.request.body.value,
        type: ctx.request.body.fileType,
      }
      messages.push(responseObject);
      console.log(messages);

      ctx.response.body = { responseMessage: responseObject.value };
      ctx.response.status = 201; 
    }

    if (method === 'createGeoMessage') {
      const responseObject = {
        latitude: ctx.request.body.latitude,
        longitude: ctx.request.body.longitude,
        type: ctx.request.body.type,
      }
      messages.push(responseObject);

      ctx.response.body = { responseLatitude: responseObject.latitude, responseLongitude: responseObject.longitude};
      ctx.response.status = 201; 
    }

    if (method === 'deleteMessages') {
      messages = [];

      ctx.response.body = { responseMessage: 'success' };
      ctx.response.status = 201; 
    }

    return;
  }
  await next();
});

app.use(async (ctx, next) => {
  if (ctx.request.method === 'GET') {
    ctx.response.body = messages;
    console.log(messages);
  }
  await next();
});

const server = http.createServer(app.callback());
const port = 7070;

server.listen(port, (err) => {
  if (err) {
    console.error('Server startup error:', err);
    return;
  }
  console.log('Server is listening on port ' + port);
});
