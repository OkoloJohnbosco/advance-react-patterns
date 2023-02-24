import React, { Component, useState } from "react";

const MediumClap = () => {
  return (
    <button>
      <ClapIcon />
      <ClapCount count={2} />
      <ClapTotal />
    </button>
  );
};

const ClapCount = ({ count }) => (
  <span>+ {count}</span>
);

const ClapIcon = () => (
  <p>Clap Count</p>
);

const ClapTotal = () => (
  <p>Clap Count</p>
);

export default MediumClap;
