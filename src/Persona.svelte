<script>
  import { getClient, query, mutation } from "svelte-apollo";
  import Swal from "sweetalert2";
  import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle,Icon} from "sveltestrap";
  import { getPersonas, getDepartment, getPersonaById } from "./queries";
  import { addPersona, updatePersona, deletePersona } from "./mutations";
  import { onMount } from 'svelte';
  const { session } = stores();

  let persona = [];
  const client = getClient();
  let fileinput, images;

//   onMount(() => {
//     const unsubscribe = session.subscribe(async ($session) => {
//         if ($session.token) {
//             const { data } = await client.query({ query: getPersonas});
//             $persona = data.persona
//         } else {
//           $persona = [];
//         }
//     });
//     console.log($session);
//     return unsubscribe;
// });
  onMount( async () => {
    const { data } = await client.query({ query: getPersonas});
    persona = await data.persona
    return () => console.log('Destroyed');
	});
 

  //const persona =  query(getPersonas);
  const dep = query(getDepartment);
  const addMutation = mutation(addPersona);
  const updateMutation = mutation(updatePersona);
  const delMutation = mutation(deletePersona);

  let fullname, points, empleados, image, x = "";
  let idpersona = 0;
  let buttontext = "Add";
  function limpiarVariables() {
    fullname = "";
    points = "";
    empleados = "";
    x = "";
    image = "";
    idpersona = 0;
    buttontext = "Add";
  }

const onFileSelected =(e)=>{
  images = e.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(images);
  reader.onload = e => {
    image = e.target.result
  };
}
  async function addTodo() {
    const data = new FormData();
    idpersona = parseInt(data.get("idpersona"), 10);
    if (idpersona == 0) {
      let validar = 0;
      for (let [pair, value] of data.entries()) {
        if (value === "") {
          Swal.fire(
            "Advertencia!",
            "Verifique que el campo: " + pair + " contenga datos!",
            "warning"
          );
          validar++;
          return false;
        }
      }
      /* begin if*/
      if (validar == 0) {
        fullname = data.get("fullname");
        points = parseInt(data.get("points"), 10);
        empleados = parseInt(data.get("empleados"), 10);
        image = data.append('image', data[4]);
        (async () => {
          await addMutation({
            variables: {
              fullname: fullname,
              points: points,
              empleados_id: empleados,
              image: image,
            },
          });
          upload.single(image)
          Swal.fire("Advertencia!", "Datos agregados!", "success");
          event.target.reset();
          limpiarVariables();
         // persona.refetch;
          //persona.refetch();
        })().catch((error) => {
          console.log(error.message);
        });
      } /* end if */
    } else {
      idpersona = parseInt(data.get("idpersona"), 10);
      fullname = data.get("fullname");
      points = parseInt(data.get("points"), 10);
      empleados = parseInt(data.get("empleados"), 10);
      image = data.append('image',images);   
      for (let [keys, value] of data.entries()) {
        console.log(keys);
      }
      (async () => {
        await updateMutation({
          variables: {
            data
          },
        });
        Swal.fire("Advertencia!", "Datos actualizados!", "success");
        persona.refetch;
        limpiarVariables();
        e.target.reset();
      })().catch((error) => {
        console.log(error.message);
      });
    }
  }
  async function gets(ids) {
    try {
      const datos = await client.query({
        query: getPersonaById,
        variables: { id: parseInt(ids, 10) },
      });
      const updates = datos.data.personas;
      for (x in updates) {
        buttontext = "Update";
        fullname = updates[x].fullname;
        points = updates[x].points;
        empleados = updates[x].empleados[0].id;
        idpersona = updates[x].id;
        image = updates[x].image;
      }
    } catch (error) {
      console.log("No se pueden obtener los datos", error);
    }
  }
  async function del(id) {
    Swal.fire({
      title: "Estas seguro de eliminar este registro?",
      text: "No podras recuperarlo una vez que lo elimines!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, Cancelar!",
    }).then((result) => {
      if (result.value) {
        (async () => {
          await delMutation({
            variables: {
              id: parseInt(id, 10),
            },
          });
          Swal.fire("Eliminado!", "Los datos han sido eliminados.", "success");
          persona.refetch();
        })().catch((error) => {
          console.log(error.message);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "La funcion ha sido cancelada", "error");
      }
    });
  }
</script>

<div class="container">
  <h5>Personas</h5>
  <form on:submit|preventDefault={addTodo}
    id="formPersona"
    enctype="multipart/form-data">
    <div class="container">      
      <div class="row">
        <div class="col-6">
          <input
            type="text"
            class="form-control"
            id="fullname"
            name="fullname"
            bind:value={fullname}
            placeholder="Full Name"
          />
          <input
            type="hidden"
            class="form-control"
            id="idpersona"
            name="idpersona"
            bind:value={idpersona}
          />
        <div class="row">
        <div class="col">
          <input
            type="number"
            class="form-control"
            id="points"
            name="points"
            bind:value={points}
            placeholder="Points"
          />
        </div>
        <div class="col">
          <select
            id="employee"
            class="form-select"
            bind:value={empleados}
            name="empleados"
          >
            <option value="" selected>Employee</option>
            {#if $dep.loading}
              Loading...
            {:else if $dep.error}
              Error: {$dep.error.message}
            {:else}
              {#each $dep.data.empleado as dep}
                <option value={dep.id}>{dep.name}</option>
              {/each}
            {/if}
          </select>
        </div>
        </div>
      </div>    
    <div class="col-6">
      <div id="app">      
        {#if image}
        <img class="avatar" src="{image}" alt="d" />
        {:else}
        <img class="avatar" src="/uploads/default.jpg" alt="" /> 
        {/if}
        <img class="upload" src="/uploads/upload.png" alt="" on:click={()=>{fileinput.click();}} />
        <input id="image" name="image" type="file" class="form-control" style="display:none" accept="image/png, image/jpeg" on:change={(e)=>onFileSelected(e)} bind:this={fileinput}/>
        
      </div>
    </div>
    <div class="col-12">
      <button type="submit" class="btn btn-primary">{buttontext}</button>
    </div>
  </div>
  </div>
    
  </form>
  {#if persona.loading}
    Loading...
  {:else if persona.error}
    Error: {persona.error.message}
  {:else}
  <div class="row">
    <h6>Se muestran: <strong>{persona.length}</strong> elementos</h6>
    {#each [...persona] as p (p.id)}    
    <div class="col-sm-3 mt-3 mb-3">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title text-uppercase">{p.fullname}</h5>
        </div>
        <div class="card-body">
          <img
            src={p.image}
            alt={p.fullname}
            class="img-responsive"
            width="100%"
            height="200px"
          />
          <h5 class="card-title">{p.empleados[0].name}</h5>
        </div>
        <div class="card-footer">
          <div class="float-start">
            <small class="text-muted"
              ><Icon name="shield-plus" style="color:#60bdd9;" />
              {p.points}</small
            >
            <small class="text-muted"
              ><Icon name="award" style="color:rgb(217, 157, 16);" />
              {p.position}</small
            >
          </div>
          <div class="float-end">
            <a
              on:click={() => gets(p.id)}
              id={p.id}
              aria-label="Edit"
              title="Edit"
              class="text-muted"><Icon name="pencil" /></a
            >
            <a
              on:click={() => del(p.id)}
              id={p.id}
              aria-label="Delete"
              title="Delete"
              class="text-muted"><Icon name="trash3" /></a
            >
          </div>
        </div>
      </div>
    </div>
  {/each}
  </div> 
  {/if}
  </div>
