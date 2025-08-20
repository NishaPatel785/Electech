

import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; 

const Rating = ({ rating }) => {
    const totalStars = 5; 

    return (
        <div style={{ color: "#FFD700", display: "flex", gap: "2px" }}>
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span key={index}>
                        {rating >= starValue ? (
                            <FaStar /> 
                        ) : rating >= starValue - 0.5 ? (
                            <FaStarHalfAlt /> 
                        ) : (
                            <FaRegStar />
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default Rating;
