import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http';

import connectDB from './db.js';
import userRouter from './routes/user.js';
import voteRouter from './routes/vote.js';
import { swaggerUi, swaggerDocs } from './swagger.js';

const app = express();
connectDB();

app.use(helmet());
app.use(xss());
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
    app.use(csurf({ cookie: true }));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`Swagger dostępny pod adresem: http://localhost:3003/api-docs`);

app.use(userRouter);
app.use(voteRouter);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('User connected to WebSocket');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

export const emitVoteUpdate = (vote) => {
    io.emit('voteUpdate', vote);
};

const port = process.env.PORT || 3003;
if (process.env.NODE_ENV !== 'test') {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
