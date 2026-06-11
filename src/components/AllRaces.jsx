import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllRaces(props) {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredRaces, setFilteredRaces] = useState([]);
    const [sortedByCollName, setSortedByCollName] = useState({ coll: "Round", isAsc: true });

    const navigate = useNavigate();

    useEffect(() => {
        getRaces();
    }, [props.year]);


    useEffect(() => {
        //filtriranje
        let result = races.filter((item) =>
            item.raceName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Circuit.circuitName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Results[0].Driver.familyName.toLowerCase().includes(props.search.toLowerCase())
        );

        //sortiranje
        switch (sortedByCollName.coll) {
            case "Round":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.round) - Number(b.round));
                } else {
                    result = result.sort((a, b) => Number(b.round) - Number(a.round));
                }
                break;
            case "Grand Prix":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        (a.raceName).toLowerCase().localeCompare((b.raceName).toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        (b.raceName).toLowerCase().localeCompare((a.raceName).toLowerCase()));
                }
                break;
            case "Circuit":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        a.Circuit.circuitName.toLowerCase().localeCompare(b.Circuit.circuitName.toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        b.Circuit.circuitName.toLowerCase().localeCompare(a.Circuit.circuitName.toLowerCase()));
                }
                break;
            case "Date":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => new Date(a.date) - new Date(b.date));
                } else {
                    result = result.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                break;
            case "Winner":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                    (a.Results[0].Driver.familyName).toLowerCase().localeCompare((b.Results[0].Driver.familyName).toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                    (b.Results[0].Driver.familyName).toLowerCase().localeCompare((a.Results[0].Driver.familyName).toLowerCase()));
                }
                break;
        }

        setFilteredRaces(result);
    }, [races, props.search, sortedByCollName]);


    const getRaces = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/results/1.json`;
        const response = await axios.get(url);
        //console.log("races=", response.data.MRData.RaceTable.Races);
        setRaces(response.data.MRData.RaceTable.Races);
        setLoading(false);
    }

    const handleClick = (id) => {
        navigate(`/raceDetails/${id}`);
    }


    const handleClickOnHeader = (collName) => {
        let currIsAsc = sortedByCollName.isAsc;
        let currCollName = collName;

        if (sortedByCollName.coll === currCollName) {
            currIsAsc = !currIsAsc;
        } else {
            currIsAsc = true;
        }
        setSortedByCollName({ coll: currCollName, isAsc: currIsAsc });
    }


    if (loading) {
        return <Loader />;
    }

    const crumbs = [
        { label: "Races", path: "" }
    ];

    return (
        <div className="wrapper">


            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>RACE CALENDAR - {props.year}</h2>
                <div className="table-container">
                <table>
                    <thead>
                        <tr >
                            <th onClick={() => handleClickOnHeader("Round")}>
                                <Link>Round {sortedByCollName.coll != "Round" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                            <th onClick={() => handleClickOnHeader("Grand Prix")}>
                                <Link>Grand Prix {sortedByCollName.coll != "Grand Prix" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                            <th onClick={() => handleClickOnHeader("Circuit")}>
                                <Link>Circuit {sortedByCollName.coll != "Circuit" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                            <th onClick={() => handleClickOnHeader("Date")}>
                                <Link>Date {sortedByCollName.coll != "Date" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                            <th onClick={() => handleClickOnHeader("Winner")}>
                                <Link>Winner {sortedByCollName.coll != "Winner" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRaces.map((race) => {
                            return (
                                <tr key={race.round}>
                                    <td>{race.round}</td>
                                    <td onClick={() => handleClick(race.round)}>
                                        <div className="link">
                                            <Flag country={getFlagByNationality(props.flags, "",
                                                race.Circuit.Location.country)}
                                                size={30} />{race.raceName}
                                        </div>
                                    </td>
                                    <td>{race.Circuit.circuitName}</td>
                                    <td>{race.date}</td>
                                    <td
                                        onClick={() => navigate(`/driverDetails/${race.Results[0].Driver.driverId}`)}>
                                        <div className="link">
                                            <Flag country={
                                                getFlagByNationality(props.flags, race.Results[0].Driver.nationality)}
                                                size={30} />
                                            {race.Results[0].Driver.familyName}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
            </div>
        </div >
    );
}

