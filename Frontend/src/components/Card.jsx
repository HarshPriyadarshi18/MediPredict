import React from "react";
import PropTypes from "prop-types"; // import PropTypes for prop type checking

const Card = ({ image, title, description }) => {
  return (
    <div>
      <img src={image} alt={title} className="card-image" />
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
    </div>
  );
}
Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Card
