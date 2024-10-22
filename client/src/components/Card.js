import { flatRollup } from "d3";

const Card = ( {data,dimension,icon,color,name}) => {
    const dataCountByDimension = flatRollup(data, v => v.length, d => d[dimension]);
    const value = dataCountByDimension.length;
    return(
        <div className="card" style={{backgroundColor: color,gridArea: name}}>
            <i className={icon}></i>
            <p>
            <span id="value">{value}</span>
            <span id="text">{dimension}</span>
            </p>
        </div>
    );
}


export default Card;