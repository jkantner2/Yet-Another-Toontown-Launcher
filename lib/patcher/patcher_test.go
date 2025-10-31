package patcher

import "testing"

func Test_decompressFile(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		sourceFile string
		destFile   string
		wantErr    bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotErr := decompressFile(tt.sourceFile, tt.destFile)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("decompressFile() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("decompressFile() succeeded unexpectedly")
			}
		})
	}
}
