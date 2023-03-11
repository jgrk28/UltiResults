--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: division; Type: TABLE; Schema: public; Owner: jacobkaplan
--

CREATE TABLE public.division (
    id integer NOT NULL,
    division_name character varying(32)
);


ALTER TABLE public.division OWNER TO jacobkaplan;

--
-- Name: game_auto_id; Type: SEQUENCE; Schema: public; Owner: jacobkaplan
--

CREATE SEQUENCE public.game_auto_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_auto_id OWNER TO jacobkaplan;

--
-- Name: games; Type: TABLE; Schema: public; Owner: jacobkaplan
--

CREATE TABLE public.games (
    id integer DEFAULT nextval('public.game_auto_id'::regclass) NOT NULL,
    tournament_id integer,
    team1_id integer,
    team2_id integer,
    start_time timestamp with time zone
);


ALTER TABLE public.games OWNER TO jacobkaplan;

--
-- Name: team_auto_id; Type: SEQUENCE; Schema: public; Owner: jacobkaplan
--

CREATE SEQUENCE public.team_auto_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_auto_id OWNER TO jacobkaplan;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: jacobkaplan
--

CREATE TABLE public.teams (
    id integer DEFAULT nextval('public.team_auto_id'::regclass) NOT NULL,
    division_id integer,
    usau_name character varying(128),
    twitter character varying(64)
);


ALTER TABLE public.teams OWNER TO jacobkaplan;

--
-- Name: tournament_auto_id; Type: SEQUENCE; Schema: public; Owner: jacobkaplan
--

CREATE SEQUENCE public.tournament_auto_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_auto_id OWNER TO jacobkaplan;

--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: jacobkaplan
--

CREATE TABLE public.tournaments (
    id integer DEFAULT nextval('public.tournament_auto_id'::regclass) NOT NULL,
    division_id integer,
    start_date date,
    end_date date,
    name character varying(128),
    location character varying(128),
    url character varying(256),
    do_stream boolean DEFAULT false,
    timezone character varying(128)
);


ALTER TABLE public.tournaments OWNER TO jacobkaplan;

--
-- Name: tweets; Type: TABLE; Schema: public; Owner: jacobkaplan
--

CREATE TABLE public.tweets (
    id numeric(20,0) NOT NULL,
    team_id integer,
    "time" timestamp with time zone,
    tweet text
);


ALTER TABLE public.tweets OWNER TO jacobkaplan;

--
-- Data for Name: division; Type: TABLE DATA; Schema: public; Owner: jacobkaplan
--

COPY public.division (id, division_name) FROM stdin;
2	D-III Women
3	D-I Men
4	D-III Men
5	Mixed
1	D-I Women
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: jacobkaplan
--

COPY public.games (id, tournament_id, team1_id, team2_id, start_time) FROM stdin;
2434	4560	250	251	2023-03-04 22:00:00+08
2435	4560	252	253	2023-03-04 22:00:00+08
2436	4560	250	253	2023-03-04 23:45:00+08
2437	4560	252	251	2023-03-04 23:45:00+08
2438	4560	250	252	2023-03-05 01:30:00+08
2439	4560	253	251	2023-03-05 01:30:00+08
2440	4560	254	255	2023-03-04 22:00:00+08
2441	4560	256	257	2023-03-04 22:00:00+08
2442	4560	254	257	2023-03-04 23:45:00+08
2443	4560	256	255	2023-03-04 23:45:00+08
2444	4560	254	256	2023-03-05 01:30:00+08
2445	4560	257	255	2023-03-05 01:30:00+08
2446	4560	258	259	2023-03-04 22:00:00+08
2447	4560	260	261	2023-03-04 22:00:00+08
2448	4560	258	261	2023-03-04 23:45:00+08
2449	4560	260	259	2023-03-04 23:45:00+08
2450	4560	258	260	2023-03-05 01:30:00+08
2451	4560	261	259	2023-03-05 01:30:00+08
2452	4560	262	263	2023-03-04 22:00:00+08
2453	4560	264	265	2023-03-04 22:00:00+08
2454	4560	262	265	2023-03-04 23:45:00+08
2455	4560	264	263	2023-03-04 23:45:00+08
2456	4560	262	264	2023-03-05 01:30:00+08
2457	4560	265	263	2023-03-05 01:30:00+08
2458	4548	234	235	2023-03-05 00:30:00+08
2459	4548	236	266	2023-03-05 00:30:00+08
2460	4548	234	266	2023-03-05 02:00:00+08
2461	4548	236	235	2023-03-05 02:00:00+08
2462	4548	234	236	2023-03-05 03:30:00+08
2463	4548	235	266	2023-03-05 03:30:00+08
2464	4548	238	239	2023-03-05 05:00:00+08
2465	4548	240	241	2023-03-05 05:00:00+08
2466	4548	238	241	2023-03-05 06:30:00+08
2467	4548	240	239	2023-03-05 06:30:00+08
2468	4548	238	240	2023-03-05 08:00:00+08
2469	4548	239	241	2023-03-05 08:00:00+08
2470	4548	242	243	2023-03-05 05:00:00+08
2471	4548	244	245	2023-03-05 05:00:00+08
2472	4548	242	245	2023-03-05 06:30:00+08
2473	4548	244	243	2023-03-05 06:30:00+08
2474	4548	242	244	2023-03-05 08:00:00+08
2475	4548	243	245	2023-03-05 08:00:00+08
2476	4548	246	247	2023-03-05 00:30:00+08
2477	4548	248	249	2023-03-05 00:30:00+08
2478	4548	246	249	2023-03-05 02:00:00+08
2479	4548	248	247	2023-03-05 02:00:00+08
2480	4548	246	248	2023-03-05 03:30:00+08
2481	4548	247	249	2023-03-05 03:30:00+08
4498	4560	250	256	2023-03-05 21:30:00+08
4499	4560	258	262	2023-03-05 21:30:00+08
4500	4560	261	263	2023-03-05 21:30:00+08
4501	4560	253	254	2023-03-05 21:30:00+08
4502	4560	250	260	2023-03-05 03:30:00+08
4503	4560	256	264	2023-03-05 03:30:00+08
4504	4560	252	258	2023-03-05 03:30:00+08
4505	4560	262	255	2023-03-05 03:30:00+08
4506	4560	261	251	2023-03-05 03:30:00+08
4507	4560	263	257	2023-03-05 03:30:00+08
4508	4560	259	253	2023-03-05 03:30:00+08
4509	4560	254	265	2023-03-06 03:30:00+08
4510	4560	260	264	2023-03-05 21:30:00+08
4511	4560	252	255	2023-03-05 21:30:00+08
4512	4560	251	257	2023-03-05 21:30:00+08
4513	4560	259	265	2023-03-05 21:30:00+08
4538	4548	240	243	2023-03-06 00:30:00+08
4539	4548	244	239	2023-03-06 00:30:00+08
4540	4548	246	236	2023-03-06 00:30:00+08
4541	4548	235	247	2023-03-06 00:30:00+08
4542	4548	266	249	2023-03-06 00:30:00+08
4543	4548	241	245	2023-03-06 00:30:00+08
5618	4560	250	254	2023-03-06 01:30:00+08
5619	4560	250	258	2023-03-05 23:30:00+08
5620	4560	261	254	2023-03-06 11:30:00+08
5633	4560	258	261	2023-03-06 01:30:00+08
5634	4560	256	263	2023-03-06 01:30:00+08
5635	4560	256	262	2023-03-05 23:30:00+08
5636	4560	263	253	2023-03-05 23:30:00+08
5637	4560	262	253	2023-03-06 01:30:00+08
5638	4560	252	265	2023-03-06 01:30:00+08
5639	4560	264	252	2023-03-05 23:30:00+08
5640	4560	257	265	2023-03-05 23:30:00+08
5645	4560	264	257	2023-03-06 01:30:00+08
5646	4560	260	259	2023-03-06 01:30:00+08
5647	4560	260	255	2023-03-05 23:30:00+08
5648	4560	251	259	2023-03-05 23:30:00+08
5649	4560	255	251	2023-03-06 01:30:00+08
5674	4548	248	238	2023-03-06 05:00:00+08
5675	4548	234	248	2023-03-06 03:30:00+08
5676	4548	242	238	2023-03-06 03:30:00+08
5677	4548	240	234	2023-03-06 02:00:00+08
5678	4548	239	248	2023-03-06 02:00:00+08
5679	4548	236	242	2023-03-06 02:00:00+08
5680	4548	247	238	2023-03-06 02:00:00+08
5685	4548	234	242	2023-03-06 05:00:00+08
5686	4548	236	239	2023-03-06 05:00:00+08
5687	4548	240	236	2023-03-06 03:30:00+08
5688	4548	239	247	2023-03-06 03:30:00+08
5689	4548	240	247	2023-03-06 05:00:00+08
5690	4548	246	244	2023-03-06 05:00:00+08
5691	4548	243	246	2023-03-06 03:30:00+08
5692	4548	244	247	2023-03-06 03:30:00+08
5693	4548	243	247	2023-03-06 05:00:00+08
5694	4548	266	245	2023-03-06 02:00:00+08
5697	4548	249	241	2023-03-06 02:00:00+08
5796	4548	244	235	2023-03-06 03:30:00+08
10492	4569	267	268	2023-03-11 22:00:00+08
10493	4569	269	270	2023-03-11 22:00:00+08
10494	4569	267	269	2023-03-11 23:30:00+08
10495	4569	268	271	2023-03-11 23:30:00+08
10496	4569	267	271	2023-03-12 01:00:00+08
10497	4569	268	270	2023-03-12 01:00:00+08
10498	4569	269	268	2023-03-12 02:30:00+08
10499	4569	271	270	2023-03-12 02:30:00+08
10500	4569	267	270	2023-03-12 04:00:00+08
10501	4569	269	271	2023-03-12 04:00:00+08
10502	4569	272	273	2023-03-11 22:00:00+08
10503	4569	274	275	2023-03-11 22:00:00+08
10504	4569	276	277	2023-03-11 22:00:00+08
10505	4569	272	274	2023-03-11 23:30:00+08
10506	4569	273	276	2023-03-11 23:30:00+08
10507	4569	275	277	2023-03-11 23:30:00+08
10508	4569	272	276	2023-03-12 01:00:00+08
10509	4569	274	277	2023-03-12 01:00:00+08
10510	4569	273	275	2023-03-12 01:00:00+08
10511	4569	272	277	2023-03-12 02:30:00+08
10512	4569	274	273	2023-03-12 02:30:00+08
10513	4569	276	275	2023-03-12 02:30:00+08
10514	4569	278	278	2023-03-12 21:00:00+08
10519	4570	279	280	2023-03-11 22:00:00+08
10520	4570	281	282	2023-03-11 22:00:00+08
10521	4570	279	282	2023-03-11 23:30:00+08
10522	4570	281	280	2023-03-11 23:30:00+08
10523	4570	279	281	2023-03-12 01:00:00+08
10524	4570	280	282	2023-03-12 01:00:00+08
10525	4570	283	284	2023-03-11 22:00:00+08
10526	4570	285	286	2023-03-11 22:00:00+08
10527	4570	283	286	2023-03-11 23:30:00+08
10528	4570	285	284	2023-03-11 23:30:00+08
10529	4570	283	285	2023-03-12 01:00:00+08
10530	4570	284	286	2023-03-12 01:00:00+08
10531	4570	287	288	2023-03-11 22:00:00+08
10532	4570	289	290	2023-03-11 22:00:00+08
10533	4570	287	290	2023-03-11 23:30:00+08
10534	4570	289	288	2023-03-11 23:30:00+08
10535	4570	287	289	2023-03-12 01:00:00+08
10536	4570	288	290	2023-03-12 01:00:00+08
10537	4570	291	291	2023-03-12 21:00:00+08
10543	4565	292	293	2023-03-12 02:00:00+08
10544	4565	294	295	2023-03-12 02:00:00+08
10545	4565	292	295	2023-03-12 03:30:00+08
10546	4565	294	293	2023-03-12 03:30:00+08
10547	4565	292	294	2023-03-12 05:00:00+08
10548	4565	293	295	2023-03-12 05:00:00+08
10549	4565	296	297	2023-03-12 02:00:00+08
10550	4565	298	299	2023-03-12 02:00:00+08
10551	4565	296	299	2023-03-12 03:30:00+08
10552	4565	298	297	2023-03-12 03:30:00+08
10553	4565	296	298	2023-03-12 05:00:00+08
10554	4565	297	299	2023-03-12 05:00:00+08
10555	4565	300	301	2023-03-12 02:00:00+08
10556	4565	302	301	2023-03-12 03:30:00+08
10557	4565	300	302	2023-03-12 05:00:00+08
10558	4565	303	304	2023-03-12 02:00:00+08
10559	4565	305	306	2023-03-12 02:00:00+08
10560	4565	303	306	2023-03-12 03:30:00+08
10561	4565	305	304	2023-03-12 03:30:00+08
10562	4565	303	305	2023-03-12 05:00:00+08
10563	4565	304	306	2023-03-12 05:00:00+08
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: jacobkaplan
--

COPY public.teams (id, division_id, usau_name, twitter) FROM stdin;
1	1	Jacob	scores_ultimate
2	1	Test	Every3Minutes
234	3	Oregon	egotime
235	3	Utah State	USUMensUltimate
238	3	Cal Poly-SLO	CORE_ultimate
252	3	Brown	BMoUltimate
253	3	Carleton College	cutrules
254	3	Massachusetts	UMassUltimateM
264	3	Minnesota	1Duck1Love
262	3	Pittsburgh	PittUltimate
260	3	Georgia	JojahUltimate
256	3	Texas	texas__tuff
250	3	North Carolina	UNC_Darkside
265	3	Northeastern	NUMensUltimate
263	3	UCLA	SmaugUltimate
261	3	Vermont	team_chill
259	3	Ohio State	pbultimate
268	1	Jacksonville State	jsufuego
257	3	North Carolina State	NCSUalpha
258	3	Colorado	CUMamabird
255	3	Tennessee	TennUltimateM
251	3	Auburn	AuburnUltimate
249	3	Southern California	uscmensultimate
248	3	California-Santa Cruz	SlugUltimate
247	3	California-San Diego	airsquids
246	3	Wisconsin	hodaglove
245	3	Stanford	stanfordblood
244	3	British Columbia	ubcmensultimate
243	3	Colorado State	csuhibida
241	3	California-Santa Barbara	UCSB_BlackTide
240	3	California	CalMensUltimate
239	3	Oregon State	OSU_ultimate
271	1	South Florida	FiascoUltimate
236	3	Victoria	uvicmultimate
242	3	Washington	sundodgers
266	3	Santa Clara	SCABUltiFris
278	1		\N
291	3		\N
295	1	Santa Clara	\N
267	1	Notre Dame	ndultimate
292	1	North Carolina	UNC_Pleiades
293	1	Washington	UWElement
294	1	California-Santa Barbara	BSkirts
296	1	Colorado	Quandaryult
297	1	California-San Diego	dcoultimate
298	1	Oregon	OregonFugue
299	1	UCLA	BLUltimate
300	1	British Columbia	UBCwomensulti
301	1	California-Davis	UCDRogue
302	1	Tufts	ewonews
303	1	Brigham Young	BYUCHIWomen
304	1	Western Washington	WWUchaos
305	1	Stanford	SuperflyUlti
306	1	California	piequeens
272	1	Chicago	uchi_supernova
269	1	Clemson	TigerliliesUlt
270	1	Florida Tech	Flux_ultimate
273	1	Tulane	TUMuses
274	1	Florida State	fsu_ultimate
275	1	Notre Dame (B)	ndultimate
276	1	Minnesota-Duluth 	UMDLakEffect
277	1	Georgia Tech (B)	GTWreckU
279	3	Notre Dame	ndultimate
280	3	Florida State	DUFtrainroll
281	3	LSU	LSUUltimateM
282	3	Georgia Southern	GASo_Ultimate
283	3	Central Florida	PupsofConflict
284	3	Minnesota-Duluth	UMD_Lights
285	3	Tulane	TUultimate
286	3	South Florida	MUltClubUSF
287	3	Harvard	HarvardRedLine
288	3	Clemson	Joint_Chiefs
289	3	Chicago	UChi_Fission
290	3	Alabama-Birmingham	UAB_Ultimate
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: jacobkaplan
--

COPY public.tournaments (id, division_id, start_date, end_date, name, location, url, do_stream, timezone) FROM stdin;
4544	3	2023-03-04	2023-03-05	Philly Special	Vineland, NJ	https://play.usaultimate.org/events/Philly-Special1/	f	America/New_York
4545	1	2023-03-04	2023-03-05	Philly Special	Vineland, NJ	https://play.usaultimate.org/events/Philly-Special1/	f	America/New_York
4546	3	2023-03-04	2023-03-05	Midwest Throwdown	Columbia, MO	https://play.usaultimate.org/events/Midwest-Throwdown-2023/	f	America/Chicago
4547	1	2023-03-04	2023-03-05	Midwest Throwdown	Columbia, MO	https://play.usaultimate.org/events/Midwest-Throwdown-2023/	f	America/Chicago
4549	3	2023-03-04	2023-03-05	No Sleep Till Brooklyn	Brooklyn, NY	https://play.usaultimate.org/events/No-Sleep-Till-Brooklyn-2023/	f	America/New_York
4550	1	2023-03-04	2023-03-05	No Sleep Till Brooklyn	Brooklyn, NY	https://play.usaultimate.org/events/No-Sleep-Till-Brooklyn-2023/	f	America/New_York
4551	3	2023-03-04	2023-03-05	Oak Creek Challenge	Frederick, MD	https://play.usaultimate.org/events/Oak-Creek-Challenge-2023/	f	America/New_York
4552	3	2023-03-04	2023-03-05	Big Sky Brawl	Meridian, ID	https://play.usaultimate.org/events/Big-Sky-Brawl1/	f	America/Denver
4553	1	2023-03-04	2023-03-05	Big Sky Brawl	Meridian, ID	https://play.usaultimate.org/events/Big-Sky-Brawl1/	f	America/Denver
4554	3	2023-03-04	2023-03-05	Huckin in the Hills IX	Morgantown, WV	https://play.usaultimate.org/events/Huckin-in-the-Hills-IX/	f	America/New_York
4555	1	2023-03-05	2023-03-05	Claremont Classic	Claremont, CA	https://play.usaultimate.org/events/Claremont-Classic/	f	America/Los_Angeles
4556	3	2023-03-04	2023-03-05	Fish Bowl	Harrisonburg, VA	https://play.usaultimate.org/events/Fish-Bowl/	f	America/New_York
4557	3	2023-03-04	2023-03-05	PLU BBQ	Parkland, WA	https://play.usaultimate.org/events/PLU-BBQ-Mens/	f	America/Los_Angeles
4558	3	2023-03-04	2023-03-05	FCS D-III Tune Up	Advance, NC	https://play.usaultimate.org/events/FCS-D-III-Tune-Up-2023/	f	America/New_York
4559	1	2023-03-04	2023-03-05	Huckleberry Flick	Oxford, OH	https://play.usaultimate.org/events/Huckleberry-Flick-Tournament/	f	America/New_York
4561	1	2023-03-04	2023-03-05	Cherry Blossom Classic	Washington DC	https://play.usaultimate.org/events/Cherry-Blossom-Classic-2023/	f	America/New_York
4562	3	2023-03-11	2023-03-12	Natalie’s Rescue	Vineland, NJ	https://play.usaultimate.org/events/Natalies-Rescue/	f	America/New_York
4563	1	2023-03-11	2023-03-12	Natalie’s Rescue	Vineland, NJ	https://play.usaultimate.org/events/Natalies-Rescue/	f	America/New_York
4564	3	2023-03-11	2023-03-12	Oak Creek Invite	Axton, VA	https://play.usaultimate.org/events/Oak-Creek-Invite-2023/	f	America/New_York
4566	3	2023-03-11	2023-03-12	Spin City	Las Vegas, NV	https://play.usaultimate.org/events/Spin-City/	f	America/Los_Angeles
4567	1	2023-03-11	2023-03-12	Spin City	Las Vegas, NV	https://play.usaultimate.org/events/Spin-City/	f	America/Los_Angeles
4568	3	2023-03-11	2023-03-12	Centex Tier 2	Austin, TX	https://play.usaultimate.org/events/Centex-Tier-2/	f	America/Chicago
4571	3	2023-03-11	2023-03-12	Silicon Valley Rally	San Jose, CA	https://play.usaultimate.org/events/Silicon-Valley-Rally/	f	America/Los_Angeles
4572	3	2023-03-11	2023-03-12	Palouse Open	Pullman, WA	https://play.usaultimate.org/events/Palouse-Open-2023/	f	America/Los_Angeles
4573	3	2023-03-11	2023-03-12	College Huckfest	Huntsville, AL	https://play.usaultimate.org/events/2023-College-Huckfest/	f	America/Chicago
4574	3	2023-03-14	2023-03-16	High Tide 2	North Myrtle Beach, SC	https://play.usaultimate.org/events/High-Tide-Sanctioned-week-2/	f	America/New_York
4575	1	2023-03-14	2023-03-16	High Tide 2	North Myrtle Beach, SC	https://play.usaultimate.org/events/High-Tide-Sanctioned-week-2/	f	America/New_York
4576	1	2023-03-18	2023-03-19	Women’s Centex	Austin, TX	https://play.usaultimate.org/events/Womens-Centex1/	f	America/Chicago
4577	3	2023-03-18	2023-03-19	Jersey Devil	Princeton, NJ	https://play.usaultimate.org/events/Jersey-Devil1/	f	America/New_York
4578	1	2023-03-18	2023-03-19	Jersey Devil	Princeton, NJ	https://play.usaultimate.org/events/Jersey-Devil1/	f	America/New_York
4579	3	2023-03-17	2023-03-19	Centex	Austin, TX	https://play.usaultimate.org/events/Centex-2023/	f	America/Chicago
4580	3	2023-03-18	2023-03-18	Mill City Throwdown	Lowell, MA	https://play.usaultimate.org/events/Mill-City-Throwdown1/	f	America/New_York
4581	1	2023-03-19	2023-03-19	Bates’ Fourth Annual First Big Dance	Lewiston, ME	https://play.usaultimate.org/events/Bates-Fourth-Annual-First-Big-Dance/	f	America/New_York
4582	3	2023-03-18	2023-03-19	College Southerns	Statesboro, GA	https://play.usaultimate.org/events/College-Southerns---XXI/	f	America/New_York
4583	1	2023-03-18	2023-03-19	College Southerns	Statesboro, GA	https://play.usaultimate.org/events/College-Southerns---XXI/	f	America/New_York
4584	3	2023-03-18	2023-03-19	Spring Fling-adelphia	Philadelphia, PA	https://play.usaultimate.org/events/Spring-Fling-adelphia/	f	America/New_York
4585	3	2023-03-18	2023-03-19	Sundown Swiss	Irvine, CA	https://play.usaultimate.org/events/Sundown-Swiss/	f	America/Los_Angeles
4586	1	2023-03-18	2023-03-19	Desert Throw Down	Tucson, AZ	https://play.usaultimate.org/events/Desert-Throw-Down/	f	America/Denver
4587	3	2023-03-21	2023-03-23	High Tide 3	North Myrtle Beach, SC	https://play.usaultimate.org/events/High-Tide-Sanctioned-week-3/	f	America/New_York
4588	1	2023-03-21	2023-03-23	High Tide 3	North Myrtle Beach, SC	https://play.usaultimate.org/events/High-Tide-Sanctioned-week-3/	f	America/New_York
4589	3	2023-03-25	2023-03-26	Rodeo	Martinsville, VA	https://play.usaultimate.org/events/Rodeo-2023/	f	America/New_York
4590	1	2023-03-25	2023-03-26	Rodeo	Martinsville, VA	https://play.usaultimate.org/events/Rodeo-2023/	f	America/New_York
4591	3	2023-03-25	2023-03-26	King of New York	Saratoga Springs, NY	https://play.usaultimate.org/events/King-of-New-York1/	f	America/New_York
4592	1	2023-03-25	2023-03-26	King of New York	Saratoga Springs, NY	https://play.usaultimate.org/events/King-of-New-York1/	f	America/New_York
4593	3	2023-03-25	2023-03-26	Garden State	Vineland/Princeton, NJ	https://play.usaultimate.org/events/Garden-State1/	f	America/New_York
4594	1	2023-03-25	2023-03-26	Garden State	Vineland/Princeton, NJ	https://play.usaultimate.org/events/Garden-State1/	f	America/New_York
4595	3	2023-03-25	2023-03-26	Needle in a Ho-Stack	Charlotte, NC	https://play.usaultimate.org/events/Needle-in-a-Ho-Stack2/	f	America/New_York
4596	1	2023-03-25	2023-03-26	Needle in a Ho-Stack	Charlotte, NC	https://play.usaultimate.org/events/Needle-in-a-Ho-Stack2/	f	America/New_York
4560	3	2023-03-04	2023-03-05	Smoky Mountain Invite	Knoxville, TN	https://play.usaultimate.org/events/Smoky-Mountain-Invite/	t	America/New_York
4569	1	2023-03-11	2023-03-12	Tally Classic XVII	Tallahassee, FL	https://play.usaultimate.org/events/Tally-Classic-XVII/	t	America/New_York
4570	3	2023-03-11	2023-03-12	Tally Classic XVII	Tallahassee, FL	https://play.usaultimate.org/events/Tally-Classic-XVII/	t	America/New_York
4565	1	2023-03-11	2023-03-12	Stanford Invite	Stanford, CA	https://play.usaultimate.org/events/Stanford-Invite-Womens/	t	America/Los_Angeles
4597	1	2023-03-24	2023-03-26	Northwest Challenge	Seattle, WA	https://play.usaultimate.org/events/Northwest-Challenge1/	f	America/Los_Angeles
4598	3	2023-03-25	2023-03-26	New England Open	Rehoboth, MA	https://play.usaultimate.org/events/New-England-Open1/	f	America/New_York
4599	1	2023-03-25	2023-03-26	New England Open	Rehoboth, MA	https://play.usaultimate.org/events/New-England-Open1/	f	America/New_York
4600	3	2023-03-25	2023-03-26	Free State Classic	Kansas City, KS	https://play.usaultimate.org/events/2023-Free-State-Classic/	f	America/Chicago
4601	1	2023-03-25	2023-03-26	Free State Classic	Kansas City, KS	https://play.usaultimate.org/events/2023-Free-State-Classic/	f	America/Chicago
4602	3	2023-03-25	2023-03-26	Old Capitol Open	Cedar Rapids, IA	https://play.usaultimate.org/events/Old-Capitol-Open/	f	America/Chicago
4603	1	2023-03-25	2023-03-26	Old Capitol Open	Cedar Rapids, IA	https://play.usaultimate.org/events/Old-Capitol-Open/	f	America/Chicago
4604	3	2023-03-25	2023-03-26	Lincoln Land	Champaign, IL	https://play.usaultimate.org/events/Lincoln-Land-2023/	f	America/Chicago
4605	1	2023-03-25	2023-03-26	Lincoln Land	Champaign, IL	https://play.usaultimate.org/events/Lincoln-Land-2023/	f	America/Chicago
4606	3	2023-03-25	2023-03-26	Carousel City Classic	Binghamton, NY	https://play.usaultimate.org/events/Carousel-City-Classic/	f	America/New_York
4607	3	2023-03-25	2023-03-26	Layout Pigout	Haverford, PA	https://play.usaultimate.org/events/Layout-Pigout-2023/	f	America/New_York
4608	3	2023-03-28	2023-03-30	High Tide 4	North Myrtle Beach, SC	https://play.usaultimate.org/events/Northwest-Challenge1/	f	America/New_York
4610	3	2023-04-01	2023-04-02	Huck Finn	O’Fallon, IL	https://play.usaultimate.org/events/Huck-Finn1/	f	America/Chicago
4611	3	2023-04-01	2023-04-02	Northeast Classic	Saratoga Springs, NY	https://play.usaultimate.org/events/Northeast-Classic2/	f	America/New_York
4612	1	2023-04-01	2023-04-02	Northeast Classic	Saratoga Springs, NY	https://play.usaultimate.org/events/Northeast-Classic2/	f	America/New_York
4613	3	2023-04-01	2023-04-02	Fuego	Vineland, NJ	https://play.usaultimate.org/events/Fuego2/	f	America/New_York
4614	1	2023-04-01	2023-04-02	Fuego	Vineland, NJ	https://play.usaultimate.org/events/Fuego2/	f	America/New_York
4615	3	2023-04-01	2023-04-02	Atlantic Coast Open	Axton, VA	https://play.usaultimate.org/events/Atlantic-Coast-Open-2023/	f	America/New_York
4616	1	2023-04-01	2023-04-02	Atlantic Coast Open	Axton, VA	https://play.usaultimate.org/events/Atlantic-Coast-Open-2023/	f	America/New_York
4617	3	2023-04-01	2023-04-02	Illinois Invite	Champaign, IL	https://play.usaultimate.org/events/Illinois-Invite1/	f	America/Chicago
4618	1	2023-04-01	2023-04-02	Illinois Invite	Champaign, IL	https://play.usaultimate.org/events/Illinois-Invite1/	f	America/Chicago
4619	1	2023-04-01	2023-04-02	Shady Encounters	Piscataway, NJ	https://play.usaultimate.org/events/Shady-Encounters/	f	America/New_York
4620	3	2023-04-01	2023-04-02	Easterns	Little River, SC	https://play.usaultimate.org/events/Easterns-2023/	f	America/New_York
4621	1	2023-04-01	2023-04-02	Easterns	Little River, SC	https://play.usaultimate.org/events/Easterns-2023/	f	America/New_York
4622	3	2023-04-01	2023-04-02	B-team Brodown	Pittsburgh, PA	https://play.usaultimate.org/events/2023-B-team-Brodown/	f	America/New_York
4623	1	2023-04-01	2023-04-01	Emory Luminous	Atlanta, GA	https://play.usaultimate.org/events/Emory-Luminous/	f	America/New_York
4624	1	2023-04-02	2023-04-02	Kernel Kup	College Park, MD	https://play.usaultimate.org/events/Kernel-Kup/	f	America/New_York
4625	3	2023-04-01	2023-04-01	King of the Hill	Hillsdale, MI	https://play.usaultimate.org/events/King-of-the-Hill/	f	America/New_York
4626	3	2023-04-02	2023-04-02	Smithfield Classic	Smithfield, RI	https://play.usaultimate.org/events/Smithfield-Classic/	f	America/New_York
4627	2	2023-04-15	2023-04-16	Atlantic Coast [AC]	Glen Allen, VA	http://play.usaultimate.org/events/Atlantic-Coast-D-III-College-Womens-CC-2023	f	America/New_York
4628	3	2023-04-15	2023-04-16	Cascadia [NW]	Olympia, WA	http://play.usaultimate.org/events/Cascadia-D-I-College-Mens-CC-2023	f	America/Los_Angeles
4629	1	2023-04-15	2023-04-16	Cascadia [NW]	Olympia, WA	http://play.usaultimate.org/events/Cascadia-D-I-College-Womens-CC-2023	f	America/Los_Angeles
4630	1	2023-04-15	2023-04-16	Eastern Metro East [ME]	Stony Brook, NY	http://play.usaultimate.org/events/Eastern-Metro-East-D-I-College-Womens-CC-2023	f	America/New_York
4631	2	2023-04-15	2023-04-16	Eastern Metro East [ME]	Fort Ann, NY	http://play.usaultimate.org/events/Eastern-Metro-East-D-III-College-Womens-CC-2023	f	America/New_York
4632	3	2023-04-15	2023-04-16	Florida [SE]	Gainesville, FL	http://play.usaultimate.org/events/Florida-D-I-College-Mens-CC-2023	f	America/New_York
4633	1	2023-04-15	2023-04-16	Florida [SE]	Gainesville, FL	http://play.usaultimate.org/events/Florida-D-I-College-Womens-CC-2023	f	America/New_York
4634	4	2023-04-15	2023-04-16	Hudson Valley [ME]	Fort Ann, NY	http://play.usaultimate.org/events/Hudson-Valley-D-III-College-Mens-CC-2023	f	America/New_York
4635	3	2023-04-15	2023-04-16	Illinois [GL]	Rantoul, IL	http://play.usaultimate.org/events/Illinois-D-I-College-Mens-CC-2023	f	America/Chicago
4636	1	2023-04-15	2023-04-16	Illinois [GL]	Rantoul, IL	http://play.usaultimate.org/events/Illinois-D-I-College-Womens-CC-2023	f	America/Chicago
4637	1	2023-04-15	2023-04-16	Lake Superior [NC]	Madison, WI	http://play.usaultimate.org/events/Lake-Superior-D-I-College-Womens-CC-2023	f	America/Chicago
4638	3	2023-04-15	2023-04-16	Metro NY [ME]	Stony Brook, NY	http://play.usaultimate.org/events/Metro-NY-D-I-College-Mens-CC-2023	f	America/New_York
4639	4	2023-04-15	2023-04-16	Metro NY [ME]	Stony Brook, NY	http://play.usaultimate.org/events/Metro-NY-D-III-College-Mens-CC-2023	f	America/New_York
4640	2	2023-04-15	2023-04-16	North Central [NC]	Madison, WI	http://play.usaultimate.org/events/North-Central-D-III-College-Womens-CC-2023	f	America/Chicago
4641	3	2023-04-15	2023-04-16	North Texas [SC]	Lubbock, TX	http://play.usaultimate.org/events/North-Texas-D-I-College-Mens-CC-2023	f	America/Chicago
4642	3	2023-04-15	2023-04-16	Ozarks [SC]	Kansas City, MO	http://play.usaultimate.org/events/Ozarks-D-I-College-Mens-CC-2023	f	America/Chicago
4643	1	2023-04-15	2023-04-16	Ozarks [SC]	Kansas City, MO	http://play.usaultimate.org/events/Ozarks-D-I-College-Womens-CC-2023	f	America/Chicago
4644	4	2023-04-15	2023-04-16	Ozarks [SC]	Rolla, MO	http://play.usaultimate.org/events/Ozarks-D-III-College-Mens-CC-2023	f	America/Chicago
4645	3	2023-04-15	2023-04-16	Rocky Mountain [SC]	Fort Collins, CO	http://play.usaultimate.org/events/Rocky-Mountain-D-I-College-Mens-CC-2023	f	America/Denver
4646	1	2023-04-15	2023-04-16	Rocky Mountain [SC]	Fort Collins, CO	http://play.usaultimate.org/events/Rocky-Mountain-D-I-College-Womens-CC-2023	f	America/Denver
4647	4	2023-04-15	2023-04-16	Rocky Mountain [SC]	Colorado Springs, CO	http://play.usaultimate.org/events/Rocky-Mountain-D-III-College-Mens-CC-2023	f	America/Denver
4648	3	2023-04-15	2023-04-16	South Texas [SC]	Austin, TX	http://play.usaultimate.org/events/South-Texas-D-I-College-Mens-CC-2023	f	America/Chicago
4649	2	2023-04-15	2023-04-15	Southwest [SW]	Los Angeles, CA	http://play.usaultimate.org/events/Southwest-D-III-College-Womens-CC-2023	f	America/Los_Angeles
4650	1	2023-04-15	2023-04-16	Texas [SC]	San Marcos, TX	http://play.usaultimate.org/events/Texas-D-I-College-Womens-CC-2023	f	America/Chicago
4651	4	2023-04-15	2023-04-16	Texas [SC]	Houston, TX	http://play.usaultimate.org/events/Texas-D-III-College-Mens-CC-2023	f	America/Chicago
4652	3	2023-04-15	2023-04-16	West Plains [NC]	Ames, IA	http://play.usaultimate.org/events/West-Plains-D-I-College-Mens-CC-2023	f	America/Chicago
4653	1	2023-04-15	2023-04-16	Western North Central [NC]	Ames, IA	http://play.usaultimate.org/events/Western-North-Central-D-I-College-Womens-CC-2023	f	America/Chicago
4654	3	2023-04-15	2023-04-16	Western NY [ME]	Oneonta, NY	http://play.usaultimate.org/events/Western-NY-D-I-College-Mens-CC-2023	f	America/New_York
4655	1	2023-04-15	2023-04-16	Western NY [ME]	Oneonta, NY	http://play.usaultimate.org/events/Western-NY-D-I-College-Womens-CC-2023	f	America/New_York
4656	4	2023-04-15	2023-04-16	Western NY [ME]	Oneonta, NY	http://play.usaultimate.org/events/Western-NY-D-III-College-Mens-CC-2023	f	America/New_York
4657	2	2023-04-15	2023-04-16	Western NY [ME]	Oneonta, NY	http://play.usaultimate.org/events/Western-NY-D-III-College-Womens-CC-2023	f	America/New_York
4658	4	2023-04-22	2023-04-23	Atlantic Coast [AC]	Elon, NC	http://play.usaultimate.org/events/Atlantic-Coast-D-III-College-Mens-CC-2023	f	America/New_York
4659	3	2023-04-22	2023-04-23	Carolina [AC]	Bermuda Run, NC	http://play.usaultimate.org/events/Carolina-D-I-College-Mens-CC-2023	f	America/New_York
4660	1	2023-04-22	2023-04-23	Carolina [AC]	Bermuda Run, NC	http://play.usaultimate.org/events/Carolina-D-I-College-Womens-CC-2023	f	America/New_York
4661	3	2023-04-22	2023-04-23	Colonial [AC]	Frederica, DE	http://play.usaultimate.org/events/Colonial-D-I-College-Mens-CC-2023	f	America/New_York
4662	1	2023-04-22	2023-04-23	Colonial [AC]	Frederica, DE	http://play.usaultimate.org/events/Colonial-D-I-College-Womens-CC-2023	f	America/New_York
4663	3	2023-04-22	2023-04-23	Gulf Coast [SE]	Decatur, AL	http://play.usaultimate.org/events/Gulf-Coast-D-I-College-Mens-CC-2023	f	America/Chicago
4664	1	2023-04-22	2023-04-23	Gulf Coast [SE]	Decatur, AL	http://play.usaultimate.org/events/Gulf-Coast-D-I-College-Womens-CC-2023	f	America/Chicago
4665	1	2023-04-22	2023-04-23	Metro Boston [NE]	Cambridge, MA	https://play.usaultimate.org/events/Metro-Boston-D-I-College-Womens-CC-2023/	f	America/New_York
4666	2	2023-04-22	2023-04-23	North New England [NE]	Middlebury, VT	http://play.usaultimate.org/events/North-New-England-D-III-College-Womens-CC-2023	f	America/New_York
4667	4	2023-04-22	2023-04-23	Southeast [SE]	Decatur, AL	http://play.usaultimate.org/events/Southeast-D-III-College-Mens-CC-2023	f	America/Chicago
4668	2	2023-04-22	2023-04-23	Southeast [SE]	Decatur, AL	http://play.usaultimate.org/events/Southeast-D-III-College-Womens-CC-2023	f	America/Chicago
4669	3	2023-04-22	2023-04-23	Southern Appalachian [SE]	Athens, GA	http://play.usaultimate.org/events/Southern-Appalachian-D-I-College-Mens-CC-2023	f	America/New_York
4670	1	2023-04-22	2023-04-23	Southern Appalachian [SE]	Athens, GA	http://play.usaultimate.org/events/Southern-Appalachian-D-I-College-Womens-CC-2023	f	America/New_York
4671	3	2023-04-22	2023-04-23	Virginia [AC]	Glen Allen, VA	http://play.usaultimate.org/events/Virginia-D-I-College-Mens-CC-2023	f	America/New_York
4672	1	2023-04-22	2023-04-23	Virginia [AC]	Glen Allen, VA	http://play.usaultimate.org/events/Virginia-D-I-College-Womens-CC-2023	f	America/New_York
4673	3	2023-04-29	2023-04-30	North Central Regionals	Madison, WI	http://play.usaultimate.org/events/North-Central-D-I-College-Mens-Regionals-2023	f	America/Chicago
4674	1	2023-04-29	2023-04-30	North Central Regionals	Madison, WI	http://play.usaultimate.org/events/North-Central-D-I-College-Womens-Regionals-2023	f	America/Chicago
4675	3	2023-04-29	2023-04-30	South Central Regionals	Tulsa, OK	http://play.usaultimate.org/events/South-Central-D-I-College-Mens-Regionals-2023	f	America/Chicago
4676	1	2023-04-29	2023-04-30	South Central Regionals	Tulsa, OK	http://play.usaultimate.org/events/South-Central-D-I-College-Womens-Regionals-2023	f	America/Chicago
4677	4	2023-04-29	2023-04-30	South Central Regionals	Tulsa, OK	http://play.usaultimate.org/events/South-Central-D-III-College-Mens-Regionals-2023	f	America/Chicago
4678	3	2023-04-29	2023-04-30	Southeast Regionals	Tallahassee, FL	http://play.usaultimate.org/events/Southeast-D-I-College-Mens-Regionals-2023	f	America/New_York
4679	1	2023-04-29	2023-04-30	Southeast Regionals	Tallahassee, FL	http://play.usaultimate.org/events/Southeast-D-I-College-Womens-Regionals-2023	f	America/New_York
4680	3	2023-05-06	2023-05-07	Atlantic Coast Regionals	Fredericksburg, VA	http://play.usaultimate.org/events/Atlantic-Coast-D-I-College-Mens-Regionals-2023	f	America/New_York
4681	1	2023-05-06	2023-05-07	Atlantic Coast Regionals	Fredericksburg, VA	http://play.usaultimate.org/events/Atlantic-Coast-D-I-College-Womens-Regionals-2023	f	America/New_York
4682	4	2023-05-20	2023-05-22	College Championships	Obetz, OH	undefined	f	America/New_York
4683	2	2023-05-20	2023-05-22	College Championships	Obetz, OH	undefined	f	America/New_York
4684	3	2023-05-26	2023-05-29	College Championships	Mason, OH	undefined	f	America/New_York
4685	1	2023-05-26	2023-05-29	College Championships	Mason, OH	undefined	f	America/New_York
4686	1	2023-02-25	2023-02-26	Commonwealth Cup 2	Martinsville, VA	https://play.usaultimate.org/events/Commonwealth-Cup-Weekend2-2023/	f	America/New_York
4687	3	2023-02-25	2023-02-26	Bring The Huckus	Vineland, NJ	https://play.usaultimate.org/events/Bring-The-Huckus1/	f	America/New_York
4688	1	2023-02-25	2023-02-26	Bring The Huckus	Vineland, NJ	https://play.usaultimate.org/events/Bring-The-Huckus1/	f	America/New_York
4689	3	2023-02-25	2023-02-26	Easterns Qualifier	Little River, SC	https://play.usaultimate.org/events/Easterns-Qualifier-2023/	f	America/New_York
4690	3	2023-02-25	2023-02-26	Mardi Gras XXXV	Baton Rouge, LA	https://play.usaultimate.org/events/Mardi-Gras-XXXV/	f	America/Chicago
4691	1	2023-02-25	2023-02-26	Mardi Gras XXXV	Baton Rouge, LA	https://play.usaultimate.org/events/Mardi-Gras-XXXV/	f	America/Chicago
4692	1	2023-02-25	2023-02-26	PLU Womens	Tacoma, WA	https://play.usaultimate.org/events/PLU-Womens-BBQ-Tournament/	f	America/Los_Angeles
4693	3	2023-02-25	2023-02-26	Dust Bowl	Tulsa, OK	https://play.usaultimate.org/events/Dust-Bowl-2023/	f	America/Chicago
4694	1	2023-02-25	2023-02-26	Dust Bowl	Tulsa, OK	https://play.usaultimate.org/events/Dust-Bowl-2023/	f	America/Chicago
4695	3	2023-02-18	2023-02-19	Commonwealth Cup	Martinsville, VA	https://play.usaultimate.org/events/Commonwealth-Cup-Weekend1-2023/	f	America/New_York
4696	1	2023-02-18	2023-02-19	Commonwealth Cup	Martinsville, VA	https://play.usaultimate.org/events/Commonwealth-Cup-Weekend1-2023/	f	America/New_York
4697	1	2023-02-18	2023-02-19	Santa Clara Rage	Santa Clara, CA	https://play.usaultimate.org/events/Santa-Clara-Rage-Tournament/	f	America/Los_Angeles
4698	3	2023-02-18	2023-02-19	Temecula Throwdown	Temecula, CA	https://play.usaultimate.org/events/Temecula-Throwdown/	f	America/Los_Angeles
4699	3	2023-02-18	2023-02-19	Snow Melt	Colorado Springs, CO	https://play.usaultimate.org/events/Snow-Melt-2023/	f	America/Denver
4700	1	2023-02-18	2023-02-19	Snow Melt	Colorado Springs, CO	https://play.usaultimate.org/events/Snow-Melt-2023/	f	America/Denver
4701	3	2023-02-18	2023-02-20	President’s Day Invite	San Diego, CA	https://play.usaultimate.org/events/President%E2%80%99s-Day-Invite/	f	America/Los_Angeles
4702	1	2023-02-18	2023-02-20	President’s Day Invite	San Diego, CA	https://play.usaultimate.org/events/President%E2%80%99s-Day-Invite/	f	America/Los_Angeles
4703	3	2023-02-18	2023-02-20	Blue Hen Open	Newark, DE	https://play.usaultimate.org/events/Blue-Hen-Open/	f	America/New_York
4704	3	2023-02-18	2023-02-20	‘Ole Muddy Classic	Tuscaloosa, AL	https://play.usaultimate.org/events/%E2%80%98Ole-Muddy-Classic/	f	America/Chicago
4705	3	2023-02-11	2023-02-12	UMass Invite	Amherst, MA	https://play.usaultimate.org/events/UMass-Invite-2023/	f	America/New_York
4706	1	2023-02-11	2023-02-12	TOTS	Knoxville, TN	https://play.usaultimate.org/events/2023-TOTS-The-Only-Tenn-I-See/	f	America/New_York
4707	3	2023-02-11	2023-02-12	Queen City Tune Up	Rock Hill, SC	https://play.usaultimate.org/events/Queen-City-Tune-Up1/	f	America/New_York
4708	1	2023-02-11	2023-02-12	Queen City Tune Up	Rock Hill, SC	https://play.usaultimate.org/events/Queen-City-Tune-Up1/	f	America/New_York
4709	1	2023-02-11	2023-02-12	Cutlass Classic	Greenville, NC	https://play.usaultimate.org/events/Cutlass-Classic/	f	America/New_York
4710	3	2023-02-11	2023-02-12	Ugly Dome	Minneapolis, MN	https://play.usaultimate.org/events/Ugly-Dome/	f	America/Chicago
4711	3	2023-02-04	2023-02-05	Just Plain Chilly	Norman, OK	https://play.usaultimate.org/events/JPC-Just-Plain-Chilly/	f	America/Chicago
4712	3	2023-02-04	2023-02-05	Stanford Open	Stevinson, CA	https://play.usaultimate.org/events/Stanford-Open/	f	America/Los_Angeles
4713	1	2023-02-04	2023-02-05	Stanford Open	Stevinson, CA	https://play.usaultimate.org/events/Stanford-Open/	f	America/Los_Angeles
4714	3	2023-02-03	2023-02-05	Florida Warm Up	Tampa, FL	https://play.usaultimate.org/events/Florida-Warm-Up-2023/	f	America/New_York
4715	1	2023-02-04	2023-02-05	Antifreeze	Houston, TX	https://play.usaultimate.org/events/Antifreeze/	f	America/Chicago
4716	1	2023-01-28	2023-01-29	Florida Winter Classic	Gainesville, FL	https://play.usaultimate.org/events/Florida-Winter-Classic-2023/	f	America/New_York
4717	1	2023-01-28	2023-01-29	Winta Binta Vinta	Charlottesville, VA	https://play.usaultimate.org/events/Winta-Binta-Vinta/	f	America/New_York
4718	3	2023-01-27	2023-01-29	Carolina Kickoff	Chapel Hill, NC	https://play.usaultimate.org/events/Carolina-Kickoff/	f	America/New_York
4719	3	2023-01-27	2023-01-29	Santa Barbara Invitational	Santa Barbara, CA	https://play.usaultimate.org/events/Santa-Barbara-Invitational-2023/	f	America/Los_Angeles
4720	1	2023-01-27	2023-01-29	Santa Barbara Invitational	Santa Barbara, CA	https://play.usaultimate.org/events/Santa-Barbara-Invitational-2023/	f	America/Los_Angeles
4721	3	2023-01-28	2023-01-29	New Year Fest	Phoenix, AZ	https://play.usaultimate.org/events/New-Year-Fest-2023/	f	America/Denver
4722	1	2023-01-28	2023-01-29	New Year Fest	Phoenix, AZ	https://play.usaultimate.org/events/New-Year-Fest-2023/	f	America/Denver
4723	3	2023-01-28	2023-01-29	Mid Atlantic Warmup	Williamsburg, VA	https://play.usaultimate.org/events/Mid-Atlantic-Warmup/	f	America/New_York
4724	1	2023-01-28	2023-01-29	T-Town Throwdown	Tuscaloosa, AL	https://play.usaultimate.org/events/T-Town-Throwdown1/	f	America/Chicago
4725	3	2023-01-28	2023-01-29	T-Town Throwdown	Tuscaloosa, AL	https://play.usaultimate.org/events/T-Town-Throwdown1/	f	America/Chicago
4726	1	2023-01-21	2023-01-22	Carolina Kickoff	Chapel Hill, NC	https://play.usaultimate.org/events/Carolina-Kickoff-womens-and-nonbinary/schedule/Women/CollegeWomen/	f	America/New_York
4727	3	2023-01-21	2023-01-22	Pacific Confrontational	Corvallis, OR	https://play.usaultimate.org/events/Pacific-Confrontational-Pac-Con/	f	America/Los_Angeles
4728	3	2023-01-21	2023-01-22	Tupelo Tuneup	Tuplo, MS	https://play.usaultimate.org/events/Tupelo-Tuneup/	f	America/Chicago
4729	3	2023-01-21	2023-01-22	Presidents Day Qualifier	San Luis Obispo, CA	https://play.usaultimate.org/events/Presidents-Day-Qualifier/	f	America/Los_Angeles
4548	3	2023-03-04	2023-03-05	Stanford Invite	Stanford, CA	https://play.usaultimate.org/events/Stanford-Invite-Mens/	t	America/Los_Angeles
27847	3	2023-03-25	2023-03-26	Strong Island	Stony Brook, NY	https://play.usaultimate.org/events/Strong-Island-2023/	f	America/New_York
27848	3	2023-03-25	2023-03-26	Late Blooming Bids	Cromwell, CT	https://play.usaultimate.org/events/Late-Blooming-Bids/	f	America/New_York
27849	1	2023-03-25	2023-03-26	Bonanza	Harrisonburg, VA	https://play.usaultimate.org/events/Bonanza-2023/	f	America/New_York
27870	3	2023-04-15	2023-04-16	Big Sky [NW]	Missoula, MT	http://play.usaultimate.org/events/Big-Sky-D-I-College-Mens-CC-2023	f	America/Denver
27871	1	2023-04-15	2023-04-16	Big Sky [NW]	Missoula, MT	http://play.usaultimate.org/events/Big-Sky-D-I-College-Womens-CC-2023	f	America/Denver
27886	2	2023-04-15	2023-04-16	Northwest [NW]	Tacoma, WA	http://play.usaultimate.org/events/Northwest-D-III-College-Womens-CC-2023	f	America/Los_Angeles
27893	2	2023-04-15	2023-04-16	South Central [SC]	Houston, TX	http://play.usaultimate.org/events/South-Central-D-III-College-Womens-CC-2023	f	America/Chicago
27921	3	2023-04-29	2023-04-30	Northwest Regionals	Salt Lake City, UT	http://play.usaultimate.org/events/Northwest-D-I-College-Mens-Regionals-2023	f	America/Denver
27922	1	2023-04-29	2023-04-30	Northwest Regionals	Salt Lake City, UT	http://play.usaultimate.org/events/Northwest-D-I-College-Womens-Regionals-2023	f	America/Denver
\.


--
-- Data for Name: tweets; Type: TABLE DATA; Schema: public; Owner: jacobkaplan
--

COPY public.tweets (id, team_id, "time", tweet) FROM stdin;
1632019073021116416	253	2023-03-04 22:04:03+08	Baker -&gt; Chen!! Cut 1-0 Brown. Stream on ultiworld
1632019167103598592	252	2023-03-04 22:04:25+08	Game 1 against Carleton. They start on O
1632019407571415049	259	2023-03-04 22:05:22+08	Birds break after a huck goes OB\n\nPbUltimate: 0\nMamabird: 2
1632019493839949832	265	2023-03-04 22:05:43+08	The only thing the huskies love more than pulling the sled is forcing the disc down the open side line. Works out thanks to Ramsey laying out on a reset ( I love you Ramsey marry me please) 2-1
1632019499598618625	252	2023-03-04 22:05:44+08	0-1 Carleton
1632019739856830464	252	2023-03-04 22:06:42+08	Elliott to Henry 1-1
1632020157550788608	265	2023-03-04 22:08:21+08	Realizing I should be doing a thread so not to spam. Speaking of spam Minnesota spamming these hucks so much I might cry 2-2
1632020238928625665	254	2023-03-04 22:08:41+08	Couple of turns but they hold 1-1
1632020284340330496	259	2023-03-04 22:08:51+08	Max hucks to Charlie and Charlie back to max!\n\nPbUltimate: 1\nMamabird: 2
1632020355307929603	264	2023-03-04 22:09:08+08	Game 1 vs Northeastern we started on D and it’s 2-2
1632020641372094465	254	2023-03-04 22:10:17+08	Luca shoots it to cutter caelan sheeeesh 2-1
1632020988811436032	253	2023-03-04 22:11:39+08	Brown breaks. It’s 1-2
1632021050379628544	251	2023-03-04 22:11:54+08	Starting the day with @UNC_Darkside \nUNC up 2 breaks with a score of 3-1
1632021117849198592	252	2023-03-04 22:12:10+08	Carleton turns it. Dishy dishy dishy to the end zone. Willis to Cal 2-1
1632021139777003521	251	2023-03-04 22:12:15+08	UNC holds 4-1
1632021206235791362	259	2023-03-04 22:12:31+08	We had a chance to break. They score to hold \n\nPbUltimate: 1\nMamabird: 3
1632021231703584775	264	2023-03-04 22:12:37+08	We get a couple chances but they hold 3-2
1632021382723772416	254	2023-03-04 22:13:13+08	They hold 2-2
1632021490034962434	265	2023-03-04 22:13:39+08	Peter takes matters into his own hands and sends a floater of a backhand buck perfectly into Steve’s hands who was substituted on. Coaches with the credit on that one 3-2
1632021798773555200	251	2023-03-04 22:14:52+08	Deep shot from Luke to JAM for the hold!! 4-2
1632021941182685189	259	2023-03-04 22:15:26+08	We hold! Shin floats it to krumme!\n\nPbUltimate: 2\nMamabird: 3
1632022045281099783	254	2023-03-04 22:15:51+08	Pookie feeling himself. He hits gavin on the touchiest of hucks 3-2
1632022078420295680	252	2023-03-04 22:15:59+08	Carleton holds 2-2
1632022093301706754	253	2023-03-04 22:16:03+08	Chen -&gt; baker 2-2!!
1632022211702792194	264	2023-03-04 22:16:31+08	Ian running the show with his third assist, this one to PK. 3-3
1632022300202528768	251	2023-03-04 22:16:52+08	UNC hold. 5-2
1632022341092769792	265	2023-03-04 22:17:02+08	You’ll never guess what happened. They hucked it. And scored. 3-3
1632022551755931649	259	2023-03-04 22:17:52+08	^Sion to krumme smh \n\nThey hold on a huck\n\nPbUltimate: 2\nMamabird: 4
1632022669766848512	252	2023-03-04 22:18:20+08	Two throws needed to win that point. Leo hucks to Jacques 3-2
1632022793129807876	265	2023-03-04 22:18:50+08	Tommy and Owen effortlessly moving the disc in the handler space like cheese on crackers buh 4-3 to the woofers
1632022805507108865	254	2023-03-04 22:18:53+08	There it is. They turn, we work it up and jae hits Toby at the front cone 4-2
1632022811874041856	264	2023-03-04 22:18:54+08	They hold 4-3
1632022876822941698	251	2023-03-04 22:19:10+08	UNC break. 6-2
1632022996964524033	259	2023-03-04 22:19:38+08	Sion hucks to Peter! We hold on a down wind point\n\nPbUltimate: 3\nMamabird: 4
1632023323541422080	253	2023-03-04 22:20:56+08	Daniel to DECLAN!! 3-4
1632023323025580034	251	2023-03-04 22:20:56+08	Luke to Scott to finish an easy O point. 6-3
1632023417787383808	265	2023-03-04 22:21:18+08	A quick zone point due to Sam on the wing blocking an early throw and milking a reset for a score. Team on his back for the first break of the game 5-3
1632023523148308480	252	2023-03-04 22:21:44+08	3-3 nothing much to say about that one
1632023539376160773	259	2023-03-04 22:21:47+08	They hold on the force side of the field. They also went downwind \n\nPbUltimate: 3\nMamabird: 5
1632023664689307651	254	2023-03-04 22:22:17+08	Another break!!! Aidan finds Jaden at the front cone, you can’t stop that 5-2
1632024069360025600	265	2023-03-04 22:23:54+08	I don’t really get how this thread thing works sorry if it’s bunko to view but it’s 5-4 now
1632024166638534656	264	2023-03-04 22:24:17+08	They get a break but we hold right after 5-4
1632024219889418245	259	2023-03-04 22:24:30+08	After we turn, ANDY gets a HUGE layout D! We hold sion to Dr J!\n\nPbUltimate: 4\nMamabird: 5
1632024356107821057	254	2023-03-04 22:25:02+08	JONAH gets a D and then breaks the mark at the other end of the field to Andy another break 6-2
1632024428245577728	252	2023-03-04 22:25:19+08	No score update but we do have breaking news: Jacques layed out
1632024461338726400	264	2023-03-04 22:25:27+08	They hold 6-4
1632024680260354049	251	2023-03-04 22:26:19+08	UNC takes half 7-3.
1632024774955155458	252	2023-03-04 22:26:42+08	He didn’t catch it, but Henry gets a handblock. Noah to Jason 4-3
1632024883470258176	259	2023-03-04 22:27:08+08	Joe AND Cameron combined D to stop the huck! We break Sandy to chuck!\n\nPbUltimate: 5\nMamabird: 5
1632024967544963073	251	2023-03-04 22:27:28+08	darkside takes half 7-3. aetos down 3 breaks. we get it second half
1632025017281134595	265	2023-03-04 22:27:40+08	Peter this time with the bookends. When Peter wants the disc he gets it. Simple as that. 6-4
1632025182456905730	253	2023-03-04 22:28:19+08	George to Cullen SOPHOMORES TURN UP 4-5!!!!!!!!
1632378542229954562	253	2023-03-05 21:52:27+08	Finley to ANDERS 😍😍 2-4
1632378552816467969	251	2023-03-05 21:52:29+08	Quick O point for NC State 4-3
1632378736766078977	256	2023-03-05 21:53:13+08	O is slow to get up. UNC 5-2
1632025197648793600	252	2023-03-04 22:28:23+08	Three Brown bids and 0 d’s later, they score. 4-4
1632025464096038912	259	2023-03-04 22:29:26+08	They huck up wind and it floated but birds hold\n\nPbUltimate: 5\nMamabird: 6
1632025748507701250	264	2023-03-04 22:30:34+08	Kenji to Ian for the hold! 6-5
1632025857920212993	265	2023-03-04 22:31:00+08	Huskies are colorblind sometimes and we throw it twice dime ball straight to the other team and they do the thing to get a point 6-5
1632025872772235265	252	2023-03-04 22:31:04+08	Luca to Henry 5-4
1632025954087317506	254	2023-03-04 22:31:23+08	Sam block. Isaac lank around the mark to find… Sam! 7-2 that’s half
1632026209662976004	264	2023-03-04 22:32:24+08	They score to take half 7-5
1632026395378319361	259	2023-03-04 22:33:08+08	We hold after a lead TO! Dr J to Peter!\n\nPbUltimate: 6\nMamabird: 6
1632026496448487424	253	2023-03-04 22:33:32+08	DEC TO FINNNNNNNNN 💪🏻 5-6
1632026671791452161	265	2023-03-04 22:34:14+08	Ramsey with an uncharacteristic throw of over 10 yards but he does send an amazing throw from half field to gommy triffin huskies take half 7-5
1632026896262201344	252	2023-03-04 22:35:08+08	The nightmare cheer forces the turn, like usual, but they get it back 5-5
1632026909633544194	253	2023-03-04 22:35:11+08	New score courtesy pbo. 5s
1632027336668332034	259	2023-03-04 22:36:53+08	They hold to take half\n\nPbUltimate: 6\nMamabird: 7
1632027363000082432	255	2023-03-04 22:36:59+08	UMass takes half of the first game of the day 2-7. We’re coming out on O to start the second half!
1632027472156844032	252	2023-03-04 22:37:25+08	Carleton breaks 5-6
1632027584425754625	253	2023-03-04 22:37:52+08	CUT BREAKS!!! 6-5
1632028178792214531	251	2023-03-04 22:40:14+08	UNC comes out half with a break. 8-3
1632028266729971712	252	2023-03-04 22:40:35+08	Big huck from Elliott to Luca who catches it football style. Quick dishy to Jason 6-6. Carleton timeout
1632028655474860035	264	2023-03-04 22:42:07+08	We work it through the zone and Kenji hits Ant for the hold!
1632028669467140096	254	2023-03-04 22:42:11+08	Jonah gets a hand block and then jae hits Jonah. Down comes the hammer. BANG 8-2
1632028827177107456	265	2023-03-04 22:42:48+08	They threw something called a “hammer” ??? I didn’t realize weapons were allowed in this game but ok 7-6 still lead to the huskies
1632029107230855168	253	2023-03-04 22:43:55+08	Morph catches for HALF 7-6
1632029191020453895	252	2023-03-04 22:44:15+08	6-7 Carleton takes half
1632029263963598850	251	2023-03-04 22:44:32+08	10-3
1632029535192399872	254	2023-03-04 22:45:37+08	They hold 8-3
1632029568591872000	249	2023-03-04 22:45:45+08	guess who’s back baby https://t.co/XG9cJpF4M4
1632030027989626880	254	2023-03-04 22:47:34+08	We hold. Gavin finds carter 9-3
1632030903651254273	265	2023-03-04 22:51:03+08	After slapping a dude in the face causing an injury Owen goes bonk and finds Hundop in the end zone 8-6
1632031288222973952	249	2023-03-04 22:52:35+08	@nukemctavish https://t.co/mDLFi63NfG
1632031342513758208	259	2023-03-04 22:52:48+08	Longer point. Both teams make some turns. Sun came out to warm it up, they hold \n\nPbUltimate: 6\nMamabird: 9
1632031407135391744	251	2023-03-04 22:53:03+08	UNC hold 11-4
1632033498113425413	254	2023-03-04 23:01:22+08	Break time for Zoodisc. Jonah shoots to Aidan who turns back the clock and skies his defender 12-4
1632033670662963228	264	2023-03-04 23:02:03+08	Svetty to PK 9-8
1632033902188437511	265	2023-03-04 23:02:58+08	9-8 now this is a close one I suggest everyone get to this field immediately to see how this game turns out and to keep me company
1632033991334191106	251	2023-03-04 23:03:19+08	Short pull for Aetos score 12-6
1632034021122138112	252	2023-03-04 23:03:27+08	Henry roofs some guy (probably with a man bun), Elliott to Jason 8-8
1632037216091361283	252	2023-03-04 23:16:08+08	Noah to Jason 10-11
1632037284882022404	259	2023-03-04 23:16:25+08	They hold on a long point\n\nPbUltimate: 8\nMamabird: 12
1632037452557713411	265	2023-03-04 23:17:05+08	Trust 10-10, Owen doesn’t like zones he told me that in confidentiality so he ate up the grey duck zone
1632039872927092737	265	2023-03-04 23:26:42+08	Let’s gauge whether I’m talking into the abyss. Everybody who sees this tweet go wayo!
1632039878874595328	253	2023-03-04 23:26:43+08	MIKE BREAKS FOR THE GAME!!! CUT W 12-10
1632039893697175555	259	2023-03-04 23:26:47+08	^Btw that was Vukovic to Snead^\n\nPbUltimate: 10\nMamabird: 12
1632040505532973056	259	2023-03-04 23:29:13+08	They huck it deep on a flick \n\nGood game @CUMamabird \n\nPbUltimate: 10\nMamabird: 13
1632042794133987330	259	2023-03-04 23:38:18+08	Game 2 against @JojahUltimate we are LIVE on Ultiworld!
1632333931365421056	1	2023-03-05 18:55:11+08	testing
1632334411625807873	1	2023-03-05 18:57:05+08	hello
1632334744720662529	1	2023-03-05 18:58:25+08	retest
1632375544334409730	259	2023-03-05 21:40:32+08	They break after a drop. \nPB:2\nNE:2
1632375693760770048	251	2023-03-05 21:41:08+08	Luke got UP for a beautiful catch. 2-1
1632375750346039297	265	2023-03-05 21:41:21+08	Hohoho it’s Mr. Samta Claus with the touchy pass to rob in the endzoneeee 2-2
1632375799754944512	264	2023-03-05 21:41:33+08	Thé meatstick scores another! Bass hucks deep to Austin for a break. 3-1
1632375989308207106	\N	2023-03-05 21:42:18+08	They hold 3-2
1632377265433772033	254	2023-03-05 21:47:22+08	Smooth offense as shooter will dishes it to caelan 4-1
1632377351521665026	257	2023-03-05 21:47:43+08	Henry with a flick to Coop 2-3
1632377380500119553	264	2023-03-05 21:47:50+08	Lame. They hold 4-3
1632377551837450240	259	2023-03-05 21:48:31+08	Snead to ekko for the break\nPB: 4\nNE: 2
1632377582325776385	252	2023-03-05 21:48:38+08	The Cup Boys ™️ connect on a huck. Marty to Theo 5-2
1632377691276992515	265	2023-03-05 21:49:04+08	A disc which is just over bench’s head gives over possession and they convert 4-2
1632377904863608834	257	2023-03-05 21:49:55+08	They hold 2-4
1632377929723150336	251	2023-03-05 21:50:01+08	JAM to Lee makes the score 4-2
1632378038649491458	254	2023-03-05 21:50:27+08	Who do you think you are? I am. Artie gets the d and then Wyatt rips one to Sam at the goaline. He flips it to Jonah for the break 5-1
1632378191716274178	252	2023-03-05 21:51:03+08	Riley launches a backhand to Emmett. Marty and Theo did a little switcharoo from last point. Theo to Marty 6-2
1632378208975724544	259	2023-03-05 21:51:07+08	Cam on da phone. Big dogs on D. Chuck with a HUGE pull.  The drop the ball. Chuck to Snead. We secure the ball for a break \n\nBucks: 5\nHuskies: 2
1632378308598853632	265	2023-03-05 21:51:31+08	One of the fastest breaks I’ve seen in a while 5-2 osu now. Putting them in a false sense of security tho dw all part of the game plan
1632378481920159744	257	2023-03-05 21:52:12+08	Henry to Zac for the hold 3-4
1632378514346242048	264	2023-03-05 21:52:20+08	Nice. Couple of miscued hucks but we manage to punch it in with our own tracks kelce Anthony. 5-3
1632378534567219200	254	2023-03-05 21:52:25+08	They hold 5-2
1632379092430626816	254	2023-03-05 21:54:38+08	Caelan to Lyle on a nice away shot for the hold. 6-2
1632379135178727424	264	2023-03-05 21:54:48+08	We break again! Nice pressure from bass leads to easy connection from AK to AG. 6-3
1632379303324164099	256	2023-03-05 21:55:28+08	GAVIN with a huge D and the boys quickly punch it in. 5-3
1632379330172006400	252	2023-03-05 21:55:35+08	Willis to Caleb 7-2
1632379477547155464	259	2023-03-05 21:56:10+08	“Eliot’s got a line” - temp\nMr. Riegel, resident math(?) teacher. Tweeting. We pull. They work it and hold \n\nPB:5\nNE:3
1632379543720697857	264	2023-03-05 21:56:26+08	They hold 6-4
1632379774403215362	265	2023-03-05 21:57:21+08	Left right left right left right it looks like a video game cheat code the way we swing the disc horizontally to score 5-3
1632380145234214914	254	2023-03-05 21:58:49+08	They hold 6-3
1632380185956818946	253	2023-03-05 21:58:59+08	Great zone O point!! 3-5
1632380208002080768	252	2023-03-05 21:59:04+08	Riley to Andy to Ian 8-2 halftime
1632380332019204108	256	2023-03-05 21:59:33+08	UNC works it slowly downfield and scores. 6-3
1632380377661681665	265	2023-03-05 21:59:44+08	Dallon is absolutely massive in more ways than one but he gets a huge layout D on the reset and we get a break this time 5-4
1632380480740896770	259	2023-03-05 22:00:09+08	They D a reset and break\n\nPB:5\nNE:4
1632380638849380354	264	2023-03-05 22:00:47+08	Classic. Ian to Jirele hold. What more could you ask for? 7-4
1632380814397788161	256	2023-03-05 22:01:28+08	TUFF O working it’s magic. Beautiful tempo. Pistol Pete with the score.
1632380823390265344	254	2023-03-05 22:01:31+08	Caelan to carter for the hold. Sophomore to sophomore. Scary. 7-3
1632380920480112640	259	2023-03-05 22:01:54+08	Same thing happens\n\nPB:5\nNE:5
1632380945515925504	257	2023-03-05 22:02:00+08	Hooch to Tayyeb for the break 4-4
1632380986628382721	264	2023-03-05 22:02:10+08	They sneak it in for a hold.7-5
1632381017888550915	265	2023-03-05 22:02:17+08	AND DALLON GETS ANOTHER LAYOUT D ON THE RESET DONT TEST MY MANS 5-5
1632381064797642754	251	2023-03-05 22:02:28+08	Long point but NC State gets a break 4-4
1632381134867685376	255	2023-03-05 22:02:45+08	the last thing you see after not running the red zone set correctly https://t.co/Ila4px0zbZ
1632381305479372804	254	2023-03-05 22:03:26+08	They hold 7-4
1632381432910757891	253	2023-03-05 22:03:56+08	Cullen rips it to Sam who hits Sam for 4-6! Let’s get a break!!
1632381484894912512	251	2023-03-05 22:04:08+08	Another break for Alpha 4-5
1632381525869166593	256	2023-03-05 22:04:18+08	UNC with an impressive hit to the corner. 7-4 them
1632381534975000576	257	2023-03-05 22:04:20+08	Matti to Townsend for ANOTHER break 5-4
1632381596203380738	255	2023-03-05 22:04:35+08	playing in 9th place quarters right now. brown takes half 2-8 (games are to 15 today)
1632382034936053764	264	2023-03-05 22:06:19+08	They break us 7-6
1632382133585993728	259	2023-03-05 22:06:43+08	We turn it then they turn it and we hold\n\nPB:6\nNE:5
1632382206034190336	265	2023-03-05 22:07:00+08	Northeastern with a break opportunity but cannot concert 6-5 osu
1632382361982697472	254	2023-03-05 22:07:37+08	Cartier find pooks for half 8-4
1632382382329192448	256	2023-03-05 22:07:42+08	TUFF O gets broken. 8-4 them going into half
1632382436570005508	257	2023-03-05 22:07:55+08	They score 5-5
1632382549195386881	251	2023-03-05 22:08:22+08	Good point against some zone defense. Clark toes the line to tie it back up. 5-5
1632382773221548036	265	2023-03-05 22:09:15+08	Quick hold from northeastern Peter with an eater 6-6, who will take half 👀
1632382827344936961	259	2023-03-05 22:09:28+08	They hold\nPB: 6\nNE: 6
1632382924229074946	251	2023-03-05 22:09:52+08	Quick point for Alpha 5-6
1632383080529838082	257	2023-03-05 22:10:29+08	Zac with a huck to Sean 6-5
1632383135936663557	264	2023-03-05 22:10:42+08	Dehli meat plays catch with Owen gin and then throws the assist to PK for half. 8-5!
1632383247127658496	259	2023-03-05 22:11:08+08	Sion’s hits Tyler for the hold \nPB: 7\nNE: 6
1632383499649908738	265	2023-03-05 22:12:09+08	Okay I have 7-6 tosu but they’re not stopping for half so either it’s game to 15 or I’m definitely getting fired after this game
1632383648581267456	252	2023-03-05 22:12:44+08	They hold 8-3
1632383801488732161	257	2023-03-05 22:13:21+08	They hold 6-6
1632383957344894980	251	2023-03-05 22:13:58+08	Great throw from Carson to Dave for an easy score. 6-6
\.


--
-- Name: game_auto_id; Type: SEQUENCE SET; Schema: public; Owner: jacobkaplan
--

SELECT pg_catalog.setval('public.game_auto_id', 10707, true);


--
-- Name: team_auto_id; Type: SEQUENCE SET; Schema: public; Owner: jacobkaplan
--

SELECT pg_catalog.setval('public.team_auto_id', 306, true);


--
-- Name: tournament_auto_id; Type: SEQUENCE SET; Schema: public; Owner: jacobkaplan
--

SELECT pg_catalog.setval('public.tournament_auto_id', 35654, true);


--
-- Name: division division_pkey; Type: CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: tweets tweets_pkey; Type: CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.tweets
    ADD CONSTRAINT tweets_pkey PRIMARY KEY (id);


--
-- Name: unique_game; Type: INDEX; Schema: public; Owner: jacobkaplan
--

CREATE UNIQUE INDEX unique_game ON public.games USING btree (tournament_id, team1_id, team2_id, start_time);


--
-- Name: unique_url; Type: INDEX; Schema: public; Owner: jacobkaplan
--

CREATE UNIQUE INDEX unique_url ON public.tournaments USING btree (division_id, url);


--
-- Name: games games_team1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_team1_id_fkey FOREIGN KEY (team1_id) REFERENCES public.teams(id);


--
-- Name: games games_team2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_team2_id_fkey FOREIGN KEY (team2_id) REFERENCES public.teams(id);


--
-- Name: games games_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id);


--
-- Name: tweets tweets_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jacobkaplan
--

ALTER TABLE ONLY public.tweets
    ADD CONSTRAINT tweets_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- PostgreSQL database dump complete
--

