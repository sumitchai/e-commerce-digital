import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { Product } from './product/entities/product.entity';
import { Order } from './order/entities/order.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'host.docker.internal',
        port: 3306,
        username: 'root',
        password: '18022541',
        database: 'e_commerce',
        entities: [
            Product,
            Order,
            User
        ],
        synchronize: true,
    }),

        ProductModule,
        OrderModule,
        AuthModule,
        UsersModule
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
