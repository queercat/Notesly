import React from "react"

interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = ({ ...props }) => {
  return <div {...props}></div>
}
