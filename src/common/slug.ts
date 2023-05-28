import slugify from 'slugify';

export class Slug {
    public static slugify(value: string): string {
        return slugify(value, {
            replacement: '-',
        });
    }
}
