import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class BorrowedBook {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.borrowedBooks)
    user!: User;

    @ManyToOne(() => Book, book => book.borrowedBooks)
    book!: Book;

    @CreateDateColumn()
    borrowedAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    returnedAt!: Date | null;

    @Column({ type: "decimal", precision: 3, scale: 1, nullable: true })
    rating!: number | null;
} 