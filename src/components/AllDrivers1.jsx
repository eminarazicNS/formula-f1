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
    const [sortedByCollName, setSortedByCollName] = useState("Position");
    const [clickedCollName, setClickedCollName] = useState(sortedByCollName);
    const [isAsc, setIsAsc] = useState(true);


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
        sortData()
    }, [drivers, props.search]);

    useEffect(() => {
        sortData();
    }, [clickedCollName]);

    const sortData = () => {
        console.log("start sortData clickedCollName =", clickedCollName, 
            " sortedByCollName= ", sortedByCollName, " isAsc= ", isAsc);

        if (sortedByCollName === clickedCollName) {
            console.log("pre isAsc ", isAsc);
            setIsAsc(!isAsc);
            console.log("posle isAsc ", isAsc);
        } else {
            setIsAsc(true);
            console.log("sortedByCollName != clickedCollName. pre sortedByCollName ", sortedByCollName);
            setSortedByCollName(clickedCollName);
            console.log("sortedByCollName != clickedCollName. posle sortedByCollName ", sortedByCollName);
        }


        let result = filteredDrivers;
        switch (sortedByCollName) {
            case "Position":
                if (isAsc) {
                    result = result.sort((a, b) => Number(a.Position) - Number(b.Position));
                } else {
                    result = result.sort((a, b) => Number(b.Position) - Number(a.Position));
                }
                break;
            case "Driver":
                if (isAsc) {
                    result = result.sort((a, b) =>
                        (a.Driver.givenName).toLowerCase().localeCompare((b.Driver.givenName).toLowerCase())
                // || (a.Driver.familyName).toLowerCase().localeCompare((b.Driver.familyName).toLowerCase())
                );
                } else {
                    result = result.sort((a, b) =>
                        (b.Driver.givenName).toLowerCase().localeCompare((a.Driver.givenName).toLowerCase())
                //|| (b.Driver.familyName).toLowerCase().localeCompare((a.Driver.familyName).toLowerCase())
                );
                }
                break;
            case "Team":
                if (isAsc) {
                    result = result.sort((a, b) =>
                        a.Constructors[0].name.toLowerCase().localeCompare(b.Constructors[0].name.toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        b.Constructors[0].name.toLowerCase().localeCompare(a.Constructors[0].name.toLowerCase()));
                }
                break;
            case "Points":
                if (isAsc) {
                    result = result.sort((a, b) => Number(a.points) - Number(b.points));
                } else {
                    result = result.sort((a, b) => Number(b.points) - Number(a.points));
                }
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



    // const handleClickOnHeader = (collName) => {   

    //     if(sortedByCollName===collName){
    //         console.log("pre isAsc ",isAsc);
    //         setIsAsc(!isAsc);
    //         console.log("posle isAsc ",isAsc);
    //     } else {
    //         setIsAsc(true);
    //         console.log("pre sortedByCollName ",sortedByCollName);
    //         setSortedByCollName(collName);
    //          console.log("posle sortedByCollName ",sortedByCollName);
    //     }
    //     console.log("end handleClickOnHeader, a pre sort colName ",collName, "isAsc ",isAsc);
    //     sortData();

    // }


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
                            <th onClick={() => setClickedCollName("Position")}>
                                <Link>Position {clickedCollName != "Position" ? '' :
                                    (isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => setClickedCollName("Driver")}>
                                <Link>Driver {clickedCollName != "Driver" ? '' :
                                    (isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => setClickedCollName("Team")}>
                                <Link>Team {clickedCollName != "Team" ? '' :
                                    (isAsc ? '▲' : '▼')}</Link></th>
                            <th onClick={() => setClickedCollName("Points")}>
                                <Link>Points {clickedCollName != "Points" ? '' :
                                    (isAsc ? '▲' : '▼')}</Link></th>
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