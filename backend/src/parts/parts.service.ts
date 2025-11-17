import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { QueryPartsDto } from './dto/query-parts.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryDto: QueryPartsDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      sortBy = 'createdAt',
      order = 'desc',
    } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PartWhereInput = {};

    if (search) {
      where.OR = [{ name: { contains: search } }, { brand: { contains: search } }];
    }

    if (category) {
      where.category = category;
    }

    // Execute queries in parallel
    const [parts, total] = await Promise.all([
      this.prisma.part.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.part.count({ where }),
    ]);

    return {
      parts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const part = await this.prisma.part.findUnique({
      where: { id },
    });

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    return { part };
  }

  async create(createPartDto: CreatePartDto) {
    // Business logic validation
    if (createPartDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (createPartDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }

    const part = await this.prisma.part.create({
      data: {
        ...createPartDto,
        imageUrl: createPartDto.imageUrl || null,
      },
    });

    return {
      message: 'Part created successfully',
      part,
    };
  }

  async update(id: number, updatePartDto: UpdatePartDto) {
    // Check if part exists
    await this.findOne(id);

    // Business logic validation
    if (updatePartDto.stock !== undefined && updatePartDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (updatePartDto.price !== undefined && updatePartDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }

    const part = await this.prisma.part.update({
      where: { id },
      data: updatePartDto,
    });

    return {
      message: 'Part updated successfully',
      part,
    };
  }

  async remove(id: number) {
    // Check if part exists
    await this.findOne(id);

    await this.prisma.part.delete({
      where: { id },
    });

    return {
      message: 'Part deleted successfully',
    };
  }

  async getCategories() {
    const categories = await this.prisma.part.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return {
      categories: categories.map((c) => c.category),
    };
  }

  async getAnalytics() {
    const [totalParts, categories, totalStock] = await Promise.all([
      this.prisma.part.count(),
      this.prisma.part.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
      }),
      this.prisma.part.aggregate({
        _sum: {
          stock: true,
        },
      }),
    ]);

    return {
      totalParts,
      totalStock: totalStock._sum.stock || 0,
      categories: categories.length,
      categoryBreakdown: categories.map((cat) => ({
        category: cat.category,
        count: cat._count.category,
      })),
    };
  }
}
