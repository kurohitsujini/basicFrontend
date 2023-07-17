import { gql } from "apollo-boost";
export const addPersona = gql`
  mutation CreatePersona($fullname: String!, $points: Int!, $empleados_id: Int!, $image: Upload!) {
    createPersona(fullname: $fullname, points: $points, empleados_id: $empleados_id, image: $image) {
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
export const updatePersona = gql`
  mutation UpdatePersona($id: Int!, $fullname: String, $points: Int, $empleados_id: Int, $image: Upload){
    updatePersona(id: $id, fullname: $fullname, points: $points, empleados_id: $empleados_id, image: $image) {
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
export const deletePersona = gql`
  mutation ($id: Int!) {
    deletePersona(id: $id) {
      id
      fullname
      points
      position
      empleados {
        id
        name
        department
      }
    }
  }
`;
