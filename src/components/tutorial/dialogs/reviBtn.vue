<template>
  <div>

  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
.balao{
    background: #000;
    border-radius: 0 30px 30px 0;
    width: 300px;
    height: 100px;

    /* Position relative para a seta não exceder os limites do balão, já que vamos usar position absolute nele */
    position: relative;

    margin-bottom: 1em;
}
.balao:after{
    /* content necessário para a criação de um elemento vazio */
    content: "";

    width: 0;
    height: 0;

    /* position: absolute para manipularmos a posição da seta */
    position: absolute;

    /* Right com valor negativo para ele ficar para fora do balão de dialogo */
    right: -32px;

    /* E aqui o truque com as bordas */
    /* 50px é a metade da altura do elemento, assim temos uma seta da mesma altura que nosso elemento */
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-left: 50px solid #000;

    border-radius: 50%;

}
.balao2{
    background: rgb(207, 172, 172);
    border-radius: 15px;
    width: 300px;
    height: 100px;

    position: relative;
}
.balao2:after{

    content: "";

    width: 0;
    height: 0;

    position: absolute;

    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid rgb(131, 82, 82);

    bottom: -20px;
    left: 20%;
}

</style>
