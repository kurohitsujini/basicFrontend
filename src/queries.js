import { gql } from "apollo-boost";

export const getPersonas = gql`
  {
    persona {
      id
      fullname
      points
      position
      active
      image
      empleados {
        id
        name
        department
      }
    }
  }
`;
export const getDepartment = gql`
  {
    empleado {
      id
      name
      department
    }
  }
`;
export const getPersonaById = gql`
  query Personas($id: Int!) {
    personas(id: $id) {
      id
      fullname
      points
      position
      image
      empleados {
        id
        name
        department
      }
    }
  }
`;
