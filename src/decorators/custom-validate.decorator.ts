import { Transform } from 'class-transformer';

export function Lowercase(): PropertyDecorator {
    return Transform(({ value }) => value.toLowerCase(), { toClassOnly: true });
}

export function Capitalize(): PropertyDecorator {
    return Transform(
        ({ value }) => {
            return value
                .split(' ')
                .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
                .join(' ');
        },
        { toClassOnly: true },
    );
}
