import * as bcrypt from 'bcrypt';

export class Hash {
    public static saltOrRounds = 10;

    public static async hash(value: string): Promise<string> {
        return bcrypt.hashSync(value, Hash.saltOrRounds);
    }

    public static async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(value, hash);
    }
}
