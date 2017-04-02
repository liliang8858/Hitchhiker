import { ResObject } from '../common/res_object';
import { Collection } from '../models/collection';
import { ConnectionManager } from "./connection_manager";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";
import { User } from "../models/user";

export class CollectionService {

    static async create(name: string, desc: string, userId: string): Promise<ResObject> {
        const owner = new User();
        owner.id = userId;
        let collection = new Collection(name, desc, owner);
        await collection.save();
        return { success: true, message: '' };
    }

    static async getOwns(userId: string): Promise<Collection[]> {
        const connection = await ConnectionManager.getInstance();

        return await connection.getRepository(Collection)
            .createQueryBuilder("collection")
            .leftJoinAndSelect('collection.team', 'team')
            .innerJoinAndSelect('collection.owner', 'owner')
            .where('recycle = 0')
            .andWhere('owner.id = :userId')
            .setParameter('userId', userId)
            .getMany();
    }

    static async getByIds(ids: string[]): Promise<Collection[]> {
        const connection = await ConnectionManager.getInstance();

        return await connection.getRepository(Collection)
            .createQueryBuilder("collection")
            .leftJoinAndSelect('collection.team', 'team')
            .leftJoinAndSelect('collection.owner', 'owner')
            .where('recycle = 0')
            .andWhereInIds(ids)
            .getMany();
    }

    static async getByTeamId(teamid: string): Promise<Collection[]> {
        const connection = await ConnectionManager.getInstance();

        return await connection.getRepository(Collection)
            .createQueryBuilder("collection")
            .innerJoinAndSelect('collection.team', 'team', 'team.id=:id')
            .leftJoinAndSelect('collection.owner', 'owner')
            .where('recycle = 0')
            .setParameter('id', teamid)
            .getMany();
    }

    static async getByTeamIds(teamIds: string[]): Promise<Collection[]> {
        if (teamIds) {
            return [];
        }

        const connection = await ConnectionManager.getInstance();
        const parameters: ObjectLiteral = {};
        const whereStrs = teamIds.map((id, index) => {
            parameters[`id_${index}`] = id;
            return `team.id=:id_${index}`;
        });
        const whereStr = whereStrs.length > 1 ? "(" + whereStrs.join(" OR ") + ")" : whereStrs[0];

        return await connection.getRepository(Collection)
            .createQueryBuilder("collection")
            .innerJoinAndSelect('collection.team', 'team')
            .leftJoinAndSelect('collection.owner', 'owner')
            .where('recycle = 0')
            .andWhere(whereStr, parameters)
            .getMany();
    }
}