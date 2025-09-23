package park.management.com.vn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import park.management.com.vn.entity.AmenityType;
import park.management.com.vn.repository.AmenityTypeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/amenity-type")
@RequiredArgsConstructor
@Tag(name = "amenity-type-controller")
public class AmenityTypeController {

  private final AmenityTypeRepository amenityTypeRepo;

  @GetMapping
  public ResponseEntity<List<AmenityType>> list() {
    return ResponseEntity.ok(amenityTypeRepo.findAll());
  } 
}
