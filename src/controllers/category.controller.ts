
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(@Inject('INCIDENTS_SERVICE') private readonly categoriesClient: ClientProxy) {}

    @Post()
    create(@Body() body: any): Observable<any> {
        return this.categoriesClient.send({ cmd: 'category.create' }, body);
    }

    @Get()
    findAll(): Observable<any> {
        return this.categoriesClient.send({ cmd: 'category.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.categoriesClient.send({ cmd: 'category.findOne' }, id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.categoriesClient.send({ cmd: 'category.update' }, { id, dto: body });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.categoriesClient.send({ cmd: 'category.remove' }, id);
    }
}


