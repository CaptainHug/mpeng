drop database if exists mpeng;
create database mpeng;
create user 'mpeng'@'localhost' identified by 'P3ngu1n';
grant all privileges on mpeng.* to 'mpeng'@'localhost';

use mpeng;

create table `User` (
	`userid` int unsigned not null auto_increment,
	`name` varchar(32) default null,
	`password` varchar(255) default null,
	`created` datetime default null,
	`lastlogin` datetime default null,
	primary key (`userid`),
	unique key `name` (`name`),
	key `password` (`password`)
);
