export enum Database {
	MySql = 'MySql',
	PostgreSql = 'PostgreSql',
	MariaDb = 'MariaDb',
}

export const databaseNames = {
	[Database.MySql]: 'MySQL',
	[Database.PostgreSql]: 'PostgreSQL',
	[Database.MariaDb]: 'MariaDB',
};
