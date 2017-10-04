/* USERS */

/* GENERATE GRANTS FOR DIFFERENT TYPES OF USERS*/

/* --- guest user --- */

CREATE USER 'guest'@'localhost' IDENTIFIED BY 'guest_pwd';

GRANT USAGE ON *.* TO 'guest'@'localhost' IDENTIFIED BY 'guest_pwd' 
	WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT SELECT ON robotix.component TO `guest`@`localhost`;
GRANT SELECT ON robotix.course TO `guest`@`localhost`;        ----
GRANT SELECT ON robotix.home_element TO `guest`@`localhost`;
GRANT SELECT ON robotix.kit TO `guest`@`localhost`;
GRANT SELECT ON robotix.kit_build TO `guest`@`localhost`;
GRANT SELECT ON robotix.part TO `guest`@`localhost`;
GRANT SELECT ON robotix.playlist TO `guest`@`localhost`;
GRANT INSERT ON robotix.robotix_user TO `guest`@`localhost`;
GRANT SELECT ON robotix.udemy_coupon TO `guest`@`localhost`;  ---
GRANT INSERT ON robotix.udemy_codes TO `guest`@`localhost`;   ---
GRANT SELECT ON robotix.software TO `guest`@`localhost`;
GRANT SELECT ON robotix.video TO `guest`@`localhost`;
GRANT SELECT ON robotix.videos_in_pl TO `guest`@`localhost`;

/* --- registered user --- */

CREATE USER 'user'@'localhost' IDENTIFIED BY 'user_pwd';

GRANT USAGE ON robotix.* TO 'user'@'localhost' IDENTIFIED BY 'user_pwd' 
	WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT SELECT ON robotix.component TO `user`@`localhost`;
GRANT SELECT ON robotix.course TO `user`@`localhost`;
GRANT SELECT ON robotix.home_element TO `user`@`localhost`;
GRANT SELECT ON robotix.kit TO `user`@`localhost`;
GRANT SELECT ON robotix.kit_build TO `user`@`localhost`;
GRANT SELECT ON robotix.part TO `user`@`localhost`;
GRANT SELECT ON robotix.playlist TO `user`@`localhost`;
GRANT SELECT, UPDATE, DELETE ON robotix.robotix_user TO `user`@`localhost`;
GRANT SELECT ON robotix.udemy_coupon TO `user`@`localhost`;  ---
GRANT INSERT ON robotix.udemy_codes TO `user`@`localhost`;   ---
GRANT SELECT ON robotix.software TO `user`@`localhost`;
GRANT SELECT ON robotix.video TO `user`@`localhost`;
GRANT SELECT ON robotix.videos_in_pl TO `user`@`localhost`;

/* --- admin --- */

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_pwd';

GRANT USAGE ON *.* TO 'admin'@'localhost' IDENTIFIED BY 'admin_pwd' 
	WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.component TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.course TO `guest`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.home_element TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.kit TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.kit_build TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.part TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.playlist TO `admin`@`localhost`;
GRANT SELECT ON robotix.robotix_user TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.robotix_admin TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.udemy_coupon TO `user`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.udemy_codes TO `user`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.software TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.video TO `admin`@`localhost`;
GRANT SELECT, INSERT, UPDATE, DELETE ON robotix.videos_in_pl TO `admin`@`localhost`;