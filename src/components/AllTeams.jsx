import { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllTeams(props) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [sortedByCollName, setSortedByCollName] = useState({ coll: "Position", isAsc: true });

    const navigate = useNavigate();

    useEffect(() => {
        getTeams();
    }, [props.year]);

    useEffect(() => {
        //filtriranje
        let result = teams.filter((item) =>
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
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
            case "Team":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        (a.Constructor.name).toLowerCase().localeCompare((b.Constructor.name).toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        (b.Constructor.name).toLowerCase().localeCompare((a.Constructor.name).toLowerCase()));
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

        setFilteredTeams(result);
    }, [teams, props.search, sortedByCollName]);



    const getTeams = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/constructorStandings.json`;
        const response = await axios.get(url);

        setTeams(response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        setLoading(false);
    };


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
        { label: "Teams", path: "" }
    ];


    return (
        <div className="wrapper">

            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>CONSTRUCTORS CHAMPIONSHIP - {props.year}</h2>
                <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleClickOnHeader("Position")}>
                                <Link>Round {sortedByCollName.coll != "Position" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                            <th onClick={() => handleClickOnHeader("Team")}>
                                <Link>Round {sortedByCollName.coll != "Team" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                            <th>Details</th>
                            <th onClick={() => handleClickOnHeader("Points")}>
                                <Link>Round {sortedByCollName.coll != "Points" ? '' :
                                    (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeams.map((team) => {
                            return (
                                <tr key={team.position}>
                                    <td>{team.position}</td>
                                    <td onClick={() => navigate(`/teamDetails/${team.Constructor.constructorId}`)}>
                                        <div className="link">
                                            <Flag country={getFlagByNationality(props.flags,
                                                team.Constructor.nationality)}
                                                size={30} />{team.Constructor.name}
                                        </div>
                                    </td>
                                    <td>Details
                                        <a href={team.Constructor.url} target="_blank"><OpenInNewIcon /></a>
                                    </td>
                                    <td>{team.points}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

