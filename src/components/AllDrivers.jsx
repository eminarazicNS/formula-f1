import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllDrivers(props) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [sortedByCollName, setSortedByCollName] = useState({ coll: "Position", isAsc: true });

    const navigate = useNavigate();

    useEffect(() => {
        getDrivers();
    }, [props.year]);

    useEffect(() => {
        //filtriranje
        let result = drivers.filter((item) =>
            item.Driver.givenName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructors[0].name.toLowerCase().includes(props.search.toLowerCase())
        );

        //sortiranje
        switch (sortedByCollName.coll) {
            case "Position":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.position) - Number(b.position));
                } else {
                    result = result.sort((a, b) => Number(b.position) - Number(a.position));
                }
                break;
            case "Driver":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        (a.Driver.givenName).toLowerCase().localeCompare((b.Driver.givenName).toLowerCase())
                        || (a.Driver.familyName).toLowerCase().localeCompare((b.Driver.familyName).toLowerCase())
                    );
                } else {
                    result = result.sort((a, b) =>
                        (b.Driver.givenName).toLowerCase().localeCompare((a.Driver.givenName).toLowerCase())
                        || (b.Driver.familyName).toLowerCase().localeCompare((a.Driver.familyName).toLowerCase())
                    );
                }
                break;
            case "Team":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        a.Constructors[0].name.toLowerCase().localeCompare(b.Constructors[0].name.toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        b.Constructors[0].name.toLowerCase().localeCompare(a.Constructors[0].name.toLowerCase()));
                }
                break;
            case "Points":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.points) - Number(b.points));
                } else {
                    result = result.sort((a, b) => Number(b.points) - Number(a.points));
                }
                break;
        }
        setFilteredDrivers(result);

    }, [drivers, props.search, sortedByCollName]);


    const getDrivers = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/driverStandings.json`;
        const response = await axios.get(url);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    };


    const handleClick = (id) => {
        navigate(`/driverDetails/${id}`)
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
        { label: "Drivers", path: "" }
    ];


    return (
        <div className="wrapper">
            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>DRIVERS CHAMPIONSHIP - {props.year}</h2>
                <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleClickOnHeader("Position")}>
                                <Link>Position {sortedByCollName.coll != "Position" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => handleClickOnHeader("Driver")}>
                                <Link>Driver {sortedByCollName.coll != "Driver" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => handleClickOnHeader("Team")}>
                                <Link>Team {sortedByCollName.coll != "Team" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => handleClickOnHeader("Points")}>
                                <Link>Points {sortedByCollName.coll != "Points" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.map((driver) => {
                            return (
                                <tr key={driver.position}>
                                    <td>{driver.position}</td>
                                    <td
                                        onClick={() => handleClick(driver.Driver.driverId)}>
                                        <div className="link"><Flag country={
                                            getFlagByNationality(props.flags, driver.Driver.nationality)}
                                            size={30} />
                                            {driver.Driver.givenName} {driver.Driver.familyName}
                                        </div>
                                    </td>
                                    <td
                                        onClick={() => navigate(`/teamDetails/${driver.Constructors[0].constructorId}`)}>
                                        <div className="link">
                                            {driver.Constructors[0].name}
                                        </div>
                                    </td>
                                    <td>{driver.points}</td>
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