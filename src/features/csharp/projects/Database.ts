export enum Database {
	PostgreSql = 'PostgreSql',
	MySql = 'MySql',
}

export const databaseNames = {
	[Database.PostgreSql]: 'PostgreSQL',
	[Database.MySql]: 'MySQL',
};
