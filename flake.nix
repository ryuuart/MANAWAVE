{
    description = "This is a template to make amazing projects or other templates.";

    inputs = {
        nixpkgs.url = "github:NixOs/nixpkgs";
        flake-utils.url = "github:numtide/flake-utils";
    };
  
    outputs = { self, nixpkgs, flake-utils }: 
        flake-utils.lib.eachDefaultSystem (system:
        let 
            pkgs = import nixpkgs { inherit system; };
        in rec {
            devShells.default = pkgs.mkShell {
                packages = [ pkgs.nodejs ];

                shellHook = ''
                    echo
                    echo "     [[[[[  WELCOME TO THE NEBULA  ]]]]]"
                    echo "     ᚤᛟᚢ ᚨᚱᛖ ᛒᛖᚲᛟᛗᛁᚾᚷ ᛟᚾᛖ ᚹᛁᛏᚺ ᛏᚺᛖ ᛋᛏᚨᚱᛋ"
                    echo "     [[[[[  •+-#—*#•-##++-*+-+••## ]]]]]"
                    echo
                '';
            };
        }
    );
}