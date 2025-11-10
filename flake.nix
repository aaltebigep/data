{
  description = "AAL TEBİGEP Açık Veri Arşivi";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
          system:
          function {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      devShells = forAllSystems (
        { pkgs, ... }:
        {
          default = pkgs.mkShellNoCC {
            name = "aaltegibep-data";
            meta.description = "AAL TEBİGEP Açık Veri Arşivi";
            packages = [ pkgs.deno ];
          };
        }
      );
    };
}
