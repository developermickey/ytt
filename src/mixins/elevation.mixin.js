export default {
  props: {
    elevation: {
      type: [ Number, String],
    }
  },
  computed: {
    computedElevation(){
      return this.elevation;
    },
    elevationClasses(){
      const elevation = this.computedElevation;
      let classes;

      if ( (elevation == null) || isNaN(parseInt(elevation)) ) {
        classes = {};
      }
      else{
        classes = { [`elevation-${this.elevation}`]: true };
      }
      return  classes;
    }
  },
}