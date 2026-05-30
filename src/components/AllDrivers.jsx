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
    const [sortByCollName, setSortByCollName] = useState("position");

    const navigate = useNavigate();

    useEffect(() => {
        getDrivers();
    }, [props.year]);

    useEffect(() => {
        const result = drivers.filter((item) =>
            item.Driver.givenName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructors[0].name.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredDrivers(result);
    }, [drivers, props.search]);

    useEffect(() => {
        sortData(sortByCollName);
    }, [filteredDrivers, sortByCollName]);

    const sortData = (collName) => {
        let result = filteredDrivers;
        switch (collName) {
            case "position": result = result.sort((a, b) => Number(a.position) - Number(b.position));
                break;
            case "driver": result = result.sort((a, b) =>
                (a.Driver.givenName + a.Driver.familyName).toLowerCase().localeCompare((b.Driver.givenName + b.Driver.familyName).toLowerCase()));
                break;
            case "team": result = result.sort((a, b) =>
                a.Constructors[0].name.toLowerCase().localeCompare(b.Constructors[0].name.toLowerCase()));
                break;
            case "points": result = result.sort((a, b) => Number(a.points) - Number(b.points));
                break;
        }
        setFilteredDrivers(result);
    }




    const getDrivers = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/driverStandings.json`;
        const response = await axios.get(url);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    };


    const handleClick = (id) => {
        navigate(`/driverDetails/${id}`)
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
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => setSortByCollName("position")}
                            ><Link>Position {sortByCollName === "position" ? '▲' : ''}</Link></th>
                            <th onClick={() => setSortByCollName("driver")}
                            ><Link>Driver  {sortByCollName === "driver" ? '▲' : ''}</Link></th>
                            <th onClick={() => setSortByCollName("team")}
                            ><Link>Team  {sortByCollName === "team" ? '▲' : ''}</Link></th>
                            <th onClick={() => setSortByCollName("points")}
                            ><Link>Points  {sortByCollName === "points" ? '▲' : ''}</Link></th>
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
        </div >
    );
}