-- 영상
DROP TABLE IF EXISTS `final`.MOVIE;
CREATE TABLE `final`.MOVIE
(
    `MOVIE_ID`         VARCHAR(255) NOT NULL COMMENT '영상 코드',
    `MOVIE_KRNAME`     VARCHAR(255) NULL COMMENT '영화명(한글)',
    `MOVIE_ENGNAME`     VARCHAR(255) NULL COMMENT '영화명(영어)',
    `MOVIE_MADEDATE`   DATE         NULL COMMENT '제작연도',
    `MOVIE_OPENDATE`   DATE         NULL COMMENT '개봉일',
    `MOVIE_STATUS`     VARCHAR(255) NULL COMMENT '제작상태',
    `MOVIE_COUNTRY`    VARCHAR(255) NULL COMMENT '제작국가',
    `MOVIE_GENRE`      VARCHAR(255) NULL COMMENT '영화장르',
    `MOVIE_PRODUCER`   VARCHAR(255) NULL COMMENT '제작사',
    `MOVIE_PRODUCERID` VARCHAR(255) NULL COMMENT '제작사코드',
    PRIMARY KEY (`MOVIE_ID`)
) ENGINE = InnoDB COMMENT '영상';