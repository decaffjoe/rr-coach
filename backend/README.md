# Clone repo:

* `git clone https://gitlab.com/spongechameleon/rr-coach.git`
* `cd rr-coach`

# Setup a local postgres (database) instance:

* Install postgresql on your local machine
* Allow connections from docker containers:

    - Add to the end of `pg_hba.conf` (typically in `/var/lib/postgres/data`):

        - `host   all    all    172.17.0.0/16    md5`

    - Change in postgresql.conf (also probably in `/var/lib/postgres/data`):

        - `listen_addresses = '*'`

* Restart postgresql:

    - `systemctl restart postgresql`

# Environment variables:

* Save your host IP address (to connect to postgres from Docker):

    - From the `rr-coach` directory:

        - `chmod 755 get_host_ip.sh`

        - `./get_host_ip.sh`

* In `rr-coach/backend`:

    - `touch .env`
    - Add the following lines to `.env`:

        - `PORT=3000`

        - `DOMAIN=http://localhost`

        - `DB_PATH='postgres://<user>:<password>@hostip:5432/<db name>'`

            - Where `<user>` could be `postgres` and `<db name>` could be `rr-coach`

# Application (Docker):

* Build image:

    - `docker build -t rr_coach .`

* Run image:

    - `docker run --rm -ti --add-host=hostip:$HOST_IP -p 3000:3000 rr_coach`

## The backend API should now be accessible from http://localhost:3000
